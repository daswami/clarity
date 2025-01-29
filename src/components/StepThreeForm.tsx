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
  weight: ['400', '500'],
  subsets: ['latin'],
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: '600',
  subsets: ['latin'],
});

type FormData = {
  future: string;
  friend: string;
};

interface StepThreeFormProps {
  previousResponses: {
    decision: string;
    decisionRating: number;
    emotion: string;
    emotionRating: number;
    today: string;
    todayRating: number;
    fear: string;
    fearRating: number;
  };
  onSubmit: (data: { future: string; futureRating: number; friend: string; friendRating: number; }) => void;
}

const StepThreeForm: React.FC<StepThreeFormProps> = ({ previousResponses, onSubmit }) => {
  const {
    register,
    handleSubmit, 
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormData>();

  const [futureRating, setFutureRating] = React.useState(0);
  const [friendRating, setFriendRating] = React.useState(0);

  const handleSubmitForm = (data: FormData) => {
    let hasErrors = false;
    
    if (!futureRating && data.future) {
      setError('future', { type: 'custom', message: 'Please rate the importance' });
      hasErrors = true;
    }
    
    if (!friendRating && data.friend) {
      setError('friend', { type: 'custom', message: 'Please rate the importance' });
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    onSubmit({
      future: data.future,
      futureRating,
      friend: data.friend,
      friendRating
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
          const futureText = (formValues.namedItem('future') as HTMLTextAreaElement)?.value || '';
          const friendText = (formValues.namedItem('friend') as HTMLTextAreaElement)?.value || '';
          
          let hasErrors = false;
          
          // Check ratings only if corresponding text exists
          if (futureText && !futureRating) {
            setError('future', { type: 'custom', message: 'Please rate the importance' });
            hasErrors = true;
          }
          
          if (friendText && !friendRating) {
            setError('friend', { type: 'custom', message: 'Please rate the importance' });
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
  }, [handleSubmit, futureRating, friendRating, setError, onSubmit]);

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
        <ResponseCard
          initialText={previousResponses.today}
          initialRating={previousResponses.todayRating}
          showEditButton
        />
        <ResponseCard
          initialText={previousResponses.fear}
          initialRating={previousResponses.fearRating}
          showEditButton
        />
      </div>

      <div className="text-center mb-8">
        <span className="text-gray-600 text-sm">Step 3 of 4</span>
      </div>

      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
        <div className="space-y-3">
          <h2 className={`text-lg font-bold text-gray-800 ${quicksand.className}`}>
            Your ideal future
          </h2>
          <p className="text-gray-700">
            How would your life look five years from now if you made the "right" decision? Paint a picture of your ideal scenario.
          </p>
          <div>
            <textarea
              {...register("future", { required: "Please fill in the answer" })}
              className={`w-full p-4 rounded-2xl border ${
                errors.future?.type === 'required'
                  ? 'border-red-400 bg-red-50 text-red-500' 
                  : errors.future?.type === 'custom'
                    ? 'border-red-400 bg-red-50 text-red-500'
                    : 'border-gray-200 focus:border-teal-600'
              } h-[80px] focus:outline-none ${inter.className} text-gray-700 text-sm placeholder:text-gray-500`}
              placeholder="example: I've grown professionally in my new role while maintaining strong connections with family through regular visits. I've built a new social circle while keeping my old friendships strong"
            />
            {errors.future && (
              <p className="mt-1 text-red-500 text-sm">{errors.future.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-gray-700">How clear is this future vision to you?</p>
            <StarRating rating={futureRating} onRatingChange={(rating) => {
              setFutureRating(rating);
              if (errors.future?.message === 'Please rate the importance') {
                clearErrors('future');
              }
            }} />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className={`text-lg font-bold text-gray-800 ${quicksand.className}`}>
            Friend's perspective
          </h2>
          <p className="text-gray-700">
            If a close friend were facing your exact situation, what advice would you give them? Sometimes it's easier to see things clearly when we step outside our own perspective.
          </p>
          <div>
            <textarea
              {...register("friend", { required: "Please fill in the answer" })}
              className={`w-full p-4 rounded-2xl border ${
                errors.friend?.type === 'required'
                  ? 'border-red-400 bg-red-50 text-red-500' 
                  : errors.friend?.type === 'custom'
                    ? 'border-red-400 bg-red-50 text-red-500'
                    : 'border-gray-200 focus:border-teal-600'
              } h-[80px] focus:outline-none ${inter.className} text-gray-700 text-sm placeholder:text-gray-500`}
              placeholder="example: I would tell them to take the opportunity. Career growth in your 20s is crucial, and you can always move back if it doesn't work out. Your family will still be there"
            />
            {errors.friend && (
              <p className="mt-1 text-red-500 text-sm">{errors.friend.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-gray-700">How confident are you in this advice?</p>
            <StarRating rating={friendRating} onRatingChange={(rating) => {
              setFriendRating(rating);
              if (errors.friend?.message === 'Please rate the importance') {
                clearErrors('friend');
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

export default StepThreeForm;
