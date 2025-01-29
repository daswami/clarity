import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className={`focus:outline-none transition-colors duration-150 ${
            hoverRating >= star 
              ? 'text-teal-500' 
              : star <= rating 
                ? 'text-teal-600' 
                : 'text-gray-200'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c.3-.8 1.5-.8 1.8 0l2.3 5c.1.3.4.5.7.5l5.5.8c.8.1 1.1 1 .5 1.6l-4 4.2c-.2.2-.3.5-.3.8l1 5.4c.1.8-.7 1.4-1.4 1l-4.9-2.6c-.3-.1-.6-.1-.9 0l-4.9 2.6c-.7.4-1.5-.2-1.4-1l1-5.4c.1-.3-.1-.6-.3-.8l-4-4.2c-.6-.6-.3-1.5.5-1.6l5.5-.8c.3-.1.6-.2.7-.5l2.3-5z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default StarRating;
