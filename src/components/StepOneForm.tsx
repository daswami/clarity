import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Quicksand, Inter, Plus_Jakarta_Sans } from "next/font/google";
import StarRating from './StarRating';

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
  decision: string;
  emotion: string;
};

interface StepOneFormProps {
  onSubmit: (data: {
    decision: string;
    decisionRating: number;
    emotion: string;
    emotionRating: number;
  }) => void;
}

const StepOneForm: React.FC<StepOneFormProps> = ({ onSubmit }) => {
  const [decisionRating, setDecisionRating] = useState(0);
  const [emotionRating, setEmotionRating] = useState(0);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormData>();

  const handleFormSubmit = (data: FormData) => {
    let hasErrors = false;
    
    if (!decisionRating && data.decision) {
      setError('decision', { type: 'custom', message: 'Please rate the importance' });
      hasErrors = true;
    }
    
    if (!emotionRating && data.emotion) {
      setError('emotion', { type: 'custom', message: 'Please rate the importance' });
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    onSubmit({
      decision: data.decision,
      decisionRating,
      emotion: data.emotion,
      emotionRating
    });
  };

  useEffect(() => {
    const handleKeyPress = async (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        // Only handle Enter if not in a textarea
        if (document.activeElement?.tagName !== 'TEXTAREA') {
          event.preventDefault();
          // Get the current form values
          const formValues = (document.querySelector('form') as HTMLFormElement)?.elements;
          const decisionText = (formValues.namedItem('decision') as HTMLTextAreaElement)?.value || '';
          const emotionText = (formValues.namedItem('emotion') as HTMLTextAreaElement)?.value || '';
          
          let hasErrors = false;
          
          // Check ratings only if corresponding text exists
          if (decisionText && !decisionRating) {
            setError('decision', { type: 'custom', message: 'Please rate the importance' });
            hasErrors = true;
          }
          
          if (emotionText && !emotionRating) {
            setError('emotion', { type: 'custom', message: 'Please rate the importance' });
            hasErrors = true;
          }
          
          if (!hasErrors) {
            handleSubmit(handleFormSubmit)();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleSubmit, decisionRating, emotionRating, setError]);

  return (
    <div className="mt-8 text-left">
      <div className="text-center mb-6">
        <span className="text-gray-600 text-sm">Step 1 of 4</span>
      </div>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-3">
          <h2 className={`text-lg font-bold text-gray-800 ${quicksand.className}`}>
            What decision are you struggling with?
          </h2>
          <p className="text-gray-700">
            Share the key aspects of your dilemma and what makes it particularly challenging for you to resolve.
          </p>
          <div>
            <textarea
              {...register("decision", { required: "Please fill in the answer" })}
              className={`w-full p-4 rounded-2xl border ${
                errors.decision?.type === 'required'
                  ? 'border-red-400 bg-red-50 text-red-500' 
                  : errors.decision?.type === 'custom'
                    ? 'border-red-400 bg-red-50 text-red-500'
                    : 'border-gray-200 focus:border-teal-600'
              } h-[80px] focus:outline-none ${inter.className} text-gray-700 text-sm placeholder:text-gray-500`}
              placeholder="example: I'm torn between accepting a promotion that requires relocation or staying in my current role closer to family"
            />
            {errors.decision && (
              <p className="mt-1 text-red-500 text-sm">{errors.decision.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-gray-700">How significant is this decision to your life?</p>
            <StarRating rating={decisionRating} onRatingChange={(rating) => {
              setDecisionRating(rating);
              if (errors.decision?.message === 'Please rate the importance') {
                clearErrors('decision');
              }
            }} />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className={`text-lg font-bold text-gray-800 ${quicksand.className}`}>
            What emotions do you feel?
          </h2>
          <p className="text-gray-700">
            Describe the emotions that arise when you think about this choice. Understanding your emotional response can provide valuable insights.
          </p>
          <div>
            <textarea
              {...register("emotion", { required: "Please fill in the answer" })}
              className={`w-full p-4 rounded-2xl border ${
                errors.emotion?.type === 'required'
                  ? 'border-red-400 bg-red-50 text-red-500' 
                  : errors.emotion?.type === 'custom'
                    ? 'border-red-400 bg-red-50 text-red-500'
                    : 'border-gray-200 focus:border-teal-600'
              } h-[80px] focus:outline-none ${inter.className} text-gray-700 text-sm placeholder:text-gray-500`}
              placeholder="example: I feel excited about the career opportunity but anxious about leaving my support system. There's also guilt about potentially disappointing my family"
            />
            {errors.emotion && (
              <p className="mt-1 text-red-500 text-sm">{errors.emotion.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-gray-700">How strongly do these emotions influence your thinking?</p>
            <StarRating rating={emotionRating} onRatingChange={(rating) => {
              setEmotionRating(rating);
              if (errors.emotion?.message === 'Please rate the importance') {
                clearErrors('emotion');
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

export default StepOneForm;
