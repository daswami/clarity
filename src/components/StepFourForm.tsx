import React from 'react';
import { useForm } from 'react-hook-form';
import { Quicksand, Inter, Plus_Jakarta_Sans } from "next/font/google";
import StarRating from './StarRating';
import ResponseCard from './ResponseCard';
import EssayAngles from './EssayAngles';

const quicksand = Quicksand({
  weight: '700',
  subsets: ['latin'],
});

const inter = Inter({
  weight: ['400', '500'],
  subsets: ['latin'],
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: '600',
  subsets: ['latin'],
});

type FormData = {
  assumption: string;
};

interface StepFourFormProps {
  previousResponses: {
    decision: string;
    decisionRating: number;
    emotion: string;
    emotionRating: number;
    today: string;
    todayRating: number;
    fear: string;
    fearRating: number;
    future: string;
    futureRating: number;
    friend: string;
    friendRating: number;
  };
  onSubmit: (data: { assumption: string; assumptionRating: number; }) => void;
}

const StepFourForm: React.FC<StepFourFormProps> = ({ previousResponses, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormData>();

  const [assumptionRating, setAssumptionRating] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showLoading, setShowLoading] = React.useState(false);
  const [essayAngles, setEssayAngles] = React.useState([]);
  const [showAngles, setShowAngles] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState<{ text: string; rating: number } | null>(null);
  const [isEditable, setIsEditable] = React.useState(true);
  const [llmResponse, setLlmResponse] = React.useState<{
    title: string;
    insight: string;
    solutions: { title: string; description: string; }[];
    challenge: string;
  } | null>(null);

  const handleFormSubmit = async (data: FormData) => {
    let hasErrors = false;
    
    if (!assumptionRating && data.assumption) {
      setError('assumption', { type: 'custom', message: 'Please rate the importance' });
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    setIsLoading(true);
    setShowLoading(true);
    setSubmittedData({ text: data.assumption, rating: assumptionRating });
    setIsEditable(false);
    
    try {
      console.log(previousResponses);
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...previousResponses,
          assumption: data.assumption,
          assumptionRating
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate essay angles');
      }

      const result = await response.json();
      if (result.result) {
        setLlmResponse(result.result);
        setShowAngles(true);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setShowLoading(false);
    }

    onSubmit({
      assumption: data.assumption,
      assumptionRating
    });
  };

  const handleResubmit = (newAngles: any) => {
    setEssayAngles(newAngles);
  };

  React.useEffect(() => {
    const handleKeyPress = async (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        // Only handle Enter if not in a textarea and if form hasn't been submitted yet
        if (document.activeElement?.tagName !== 'TEXTAREA' && !submittedData) {
          event.preventDefault();
          // Get the current form values
          const formValues = (document.querySelector('form') as HTMLFormElement)?.elements.namedItem('assumption') as HTMLTextAreaElement;
          const text = formValues?.value || '';
          
          // Check if we have both text and rating
          if (text && !assumptionRating) {
            setError('assumption', { type: 'custom', message: 'Please rate the importance' });
            return;
          }
          
          if (text) {
            handleSubmit(handleFormSubmit)();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleSubmit, submittedData, assumptionRating, setError]);

  return (
    <div className="mt-8 text-left">
      <div className="flex flex-col items-end gap-4 mb-8">
        {Object.entries(previousResponses).map(([key, value], index) => {
          if (typeof value === 'string') {
            const rating = previousResponses[`${key}Rating` as keyof typeof previousResponses] as number;
            return (
              <ResponseCard
                key={key}
                initialText={value}
                initialRating={rating}
                showEditButton={true}
                editable={isEditable}
              />
            );
          }
          return null;
        })}
        {submittedData && (
          <ResponseCard
            initialText={submittedData.text}
            initialRating={submittedData.rating}
            showEditButton={true}
            editable={isEditable}
          />
        )}
      </div>

      {!submittedData && (
        <>
          <div className="text-center mb-8">
            <span className="text-gray-600 text-sm">Step 4 of 4</span>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-3">
              <h2 className={`text-lg font-bold text-gray-800 ${quicksand.className}`}>
                Hidden assumptions
              </h2>
              <p className="text-gray-700">
                What's one assumption you're making about this situation that might not be true? Sometimes our biggest barriers are the beliefs we haven't questioned.
              </p>
              <div>
                <textarea
                  {...register("assumption", { required: "Please fill in the answer" })}
                  className={`w-full p-4 rounded-2xl border ${
                    errors.assumption?.type === 'required'
                      ? 'border-red-400 bg-red-50 text-red-500' 
                      : 'border-gray-200 focus:border-teal-600'
                  } h-[80px] focus:outline-none ${inter.className} text-gray-700 text-sm placeholder:text-gray-500`}
                  placeholder="example: I assume I need to choose between career and relationships, but maybe there's a way to have both. Perhaps the distance isn't as big a barrier as I think"
                />
                {errors.assumption && (
                  <p className="mt-1 text-red-500 text-sm">{errors.assumption.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-gray-700">How much might this assumption be limiting your thinking?</p>
                <StarRating rating={assumptionRating} onRatingChange={(rating) => {
                  setAssumptionRating(rating);
                  if (errors.assumption?.message === 'Please rate the importance') {
                    clearErrors('assumption');
                  }
                }} />
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                type="submit"
                className={`bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 px-16 rounded-full hover:from-teal-600 hover:to-teal-700 ${plusJakarta.className} font-semibold text-sm transition-all`}
              >
                Generate Solutions
              </button>
            </div>
          </form>
        </>
      )}

      {showLoading && (
        <div className="mt-8 text-center">
          <p className={`text-gray-600 ${inter.className}`}>
            Analyzing your responses...
          </p>
        </div>
      )}

      {showAngles && llmResponse && (
        <div className="mt-8">
          <div className={`bg-gradient-to-r from-rose-50 via-amber-50 to-teal-50 rounded-3xl p-8 ${inter.className}`}>
            <div className="max-w-2xl mx-auto">
              <h2 className={`text-3xl font-bold text-gray-800 mb-6 text-center ${quicksand.className}`}>
                {llmResponse.title}
              </h2>
              <div className="bg-white/80 backdrop-blur rounded-lg p-6 shadow-sm mb-8">
                <h3 className={`text-xl font-bold text-gray-800 mb-4 ${quicksand.className}`}>
                  Psychological Insight
                </h3>
                <p className={`text-gray-700 ${inter.className}`}>
                  {llmResponse.insight}
                </p>
              </div>

              <div className="mt-8">
                <h3 className={`text-xl font-bold text-gray-800 mb-4 ${quicksand.className}`}>
                  Solutions & Approaches
                </h3>
                <EssayAngles
                  angles={llmResponse.solutions}
                  isLoading={isLoading}
                  isMainPage={true}
                />
              </div>

              <div className="mt-8 bg-white/80 backdrop-blur rounded-lg p-6 shadow-sm">
                <h3 className={`text-xl font-bold text-gray-800 mb-4 ${quicksand.className}`}>
                  Your Challenge
                </h3>
                <p className={`text-gray-700 ${inter.className}`}>
                  {llmResponse.challenge}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepFourForm;
