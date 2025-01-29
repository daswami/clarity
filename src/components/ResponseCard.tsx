import React, { useState } from 'react';
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import StarRating from './StarRating';

const inter = Inter({
  weight: ['400', '500'],
  subsets: ['latin'],
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: '600',
  subsets: ['latin'],
});

interface ResponseCardProps {
  initialText: string;
  initialRating: number;
  showEditButton?: boolean;
  editable?: boolean;
}

const ResponseCard: React.FC<ResponseCardProps> = ({ 
  initialText, 
  initialRating,
  showEditButton = false,
  editable = true
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const [rating, setRating] = useState(initialRating);
  const [tempText, setTempText] = useState(initialText);
  const [tempRating, setTempRating] = useState(initialRating);

  const handleCancel = () => {
    setTempText(text);
    setTempRating(rating);
    setIsEditing(false);
  };

  const handleUpdate = () => {
    setText(tempText);
    setRating(tempRating);
    setIsEditing(false);
  };

  const hasChanges = tempText !== text || tempRating !== rating;

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm p-4 w-72">      
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            className={`w-full p-3 rounded-xl border border-gray-200 focus:border-teal-600 h-[60px] focus:outline-none ${inter.className} text-gray-700 text-sm`}
          />
          <div>
            <StarRating rating={tempRating} onRatingChange={setTempRating} />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className={`px-4 py-1.5 rounded-full text-gray-600 bg-gray-100 text-sm ${plusJakarta.className} hover:bg-gray-200 transition-colors`}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={!hasChanges}
              className={`px-4 py-1.5 rounded-full text-sm ${plusJakarta.className} ${
                hasChanges 
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700' 
                  : 'text-gray-500 bg-gray-100 cursor-not-allowed'
              } transition-all`}
            >
              Update
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className={`text-gray-700 text-sm font-medium mb-2 ${inter.className}`}>{text}</p>
          <div className="flex items-center justify-between">
            <StarRating rating={rating} onRatingChange={() => {}} />
            {showEditButton && editable && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="text-gray-400 hover:text-teal-600 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseCard;
