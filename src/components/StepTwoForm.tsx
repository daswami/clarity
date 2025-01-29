import React from 'react';
import { useForm } from 'react-hook-form';
import { Quicksand, Inter, Plus_Jakarta_Sans } from "next/font/google";
import StarRating from './StarRating';
import ResponseCard from './ResponseCard';

const quicksand = Quicksand({
  weight: '700',
  subsets: ['latin'],
});

const inter = Inter({
  weight: '400',
  subsets: ['latin'],
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: '600',
  subsets: ['latin'],
});

type FormData = {
  today: string;
  fear: string;
};

interface StepTwoFormProps {
  previousResponses: {
    decision: string;
    decisionRating: number;
    emotion: string;
    emotionRating: number;
  };
  onSubmit: (data: { today: string; todayRating: number; fear: string; fearRating: number; }) => void;
  editable?: boolean;
}

const StepTwoForm: React.FC<StepTwoFormProps> = ({ previousResponses, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormData>();

  const [todayRating, setTodayRating] = React.useState(0);
  const [fearRating, setFearRating] = React.useState(0);

  const handleSubmitForm = (data: FormData) => {
    let hasErrors = false;
    
    if (!todayRating && data.today) {
      setError('today', { type: 'custom', message: 'Please rate the importance' });
      hasErrors = true;
    }
    
    if (!fearRating && data.fear) {
      setError('fear', { type: 'custom', message: 'Please rate the importance' });
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    onSubmit({
      today: data.today,
      todayRating,
      fear: data.fear,
      fearRating
    });
  };

  React.useEffect(() => {
    const handleKeyPress = async (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        // Only handle Enter if not in a textarea
        if (document.activeElement?.tagName !== 'TEXTAREA') {
          event.preventDefault();
          // Get the current form values
          const formValues = (document.querySelector('form') as HTMLFormElement)?.elements;
          const todayText = (formValues.namedItem('today') as HTMLTextAreaElement)?.value || '';
          const fearText = (formValues.namedItem('fear') as HTMLTextAreaElement)?.value || '';
          
          let hasErrors = false;
          
          // Check ratings only if corresponding text exists
          if (todayText && !todayRating) {
            setError('today', { type: 'custom', message: 'Please rate the importance' });
            hasErrors = true;
          }
          
          if (fearText && !fearRating) {
            setError('fear', { type: 'custom', message: 'Please rate the importance' });
            hasErrors = true;
          }
          
          if (!hasErrors) {
            handleSubmit(handleSubmitForm)();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleSubmit, todayRating, fearRating, setError]);

  return (
    <div className="mt-8 text-left">
      <div className="flex flex-col items-end gap-4 mb-8">
        <ResponseCard
          initialText={previousResponses.decision}
          initialRating={previousResponses.decisionRating}
          showEditButton
        />
        <ResponseCard
          initialText={previousResponses.emotion}
          initialRating={previousResponses.emotionRating}
          showEditButton
        />
      </div>

      <div className="text-center mb-8">
        <span className="text-gray-600 text-sm">Step 2 of 4</span>
      </div>

      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
        <div className="space-y-3">
          <h2 className={`text-lg font-bold text-gray-800 ${quicksand.className}`}>
            If you had to decide today
          </h2>
          <p className="text-gray-700">
            What would your choice be, and what are the key factors driving this immediate decision?
          </p>
          <div>
            <textarea
              {...register("today", { required: "Please fill in the answer" })}
              className={`w-full p-4 rounded-2xl border ${
                errors.today?.type === 'required'
                  ? 'border-red-400 bg-red-50 text-red-500' 
                  : 'border-gray-200 focus:border-teal-600'
              } h-[80px] focus:outline-none ${inter.className} text-gray-700 text-sm placeholder:text-gray-500`}
              placeholder="example: I would take the promotion because the career growth aligns with my long-term goals, even though the relocation would be challenging"
            />
            {errors.today && (
              <p className="mt-1 text-red-500 text-sm">{errors.today.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-gray-700">How confident are you about this immediate choice?</p>
            <StarRating rating={todayRating} onRatingChange={(rating) => {
              setTodayRating(rating);
              if (errors.today?.message === 'Please rate the importance') {
                clearErrors('today');
              }
            }} />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className={`text-lg font-bold text-gray-800 ${quicksand.className}`}>
            What do you fear most?
          </h2>
          <p className="text-gray-700">
            Describe your biggest concern about making the wrong choice. What potential negative outcome worries you the most?
          </p>
          <div>
            <textarea
              {...register("fear", { required: "Please fill in the answer" })}
              className={`w-full p-4 rounded-2xl border ${
                errors.fear?.type === 'required'
                  ? 'border-red-400 bg-red-50 text-red-500' 
                  : 'border-gray-200 focus:border-teal-600'
              } h-[80px] focus:outline-none ${inter.className} text-gray-700 text-sm placeholder:text-gray-500`}
              placeholder="example: I fear that moving away might damage important relationships, and I could end up feeling isolated in a new city without my support system"
            />
            {errors.fear && (
              <p className="mt-1 text-red-500 text-sm">{errors.fear.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-gray-700">How much does this fear influence your decision-making?</p>
            <StarRating rating={fearRating} onRatingChange={(rating) => {
              setFearRating(rating);
              if (errors.fear?.message === 'Please rate the importance') {
                clearErrors('fear');
              }
            }} />
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            type="submit"
            className={`bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 px-16 rounded-full hover:from-teal-600 hover:to-teal-700 ${plusJakarta.className} font-semibold text-sm transition-all`}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepTwoForm;
