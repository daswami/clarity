import React, { useState, useEffect } from 'react';
import { Inter, Quicksand, Plus_Jakarta_Sans } from "next/font/google";
import BookmarkIcon from './BookmarkIcon';
import Link from 'next/link';

const inter = Inter({
  weight: ['400', '500'],
  subsets: ['latin'],
});

const quicksand = Quicksand({
  weight: '700',
  subsets: ['latin'],
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: '600',
  subsets: ['latin'],
});

interface Angle {
  title: string;
  description: string;
}

interface EssayAnglesProps {
  angles: Angle[];
  isLoading: boolean;
  formData?: any;
  onResubmit?: (newAngles: any) => void;
  isMainPage?: boolean;
  entryId?: number;
}

const EssayAngles: React.FC<EssayAnglesProps> = ({ 
  angles, 
  isLoading,
  formData,
  onResubmit,
  isMainPage = false,
  entryId
}) => {
  const [savedCards, setSavedCards] = useState<{index: number}[]>([]);
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [showAdjustment, setShowAdjustment] = useState(false);
  const [adjustmentText, setAdjustmentText] = useState('');
  const [adjustmentError, setAdjustmentError] = useState<string | null>(null);

  const handleSaveCard = async (angle: Angle, index: number, e: React.MouseEvent) => {
    e.stopPropagation();

    const isCurrentlySaved = savedCards.some(card => card.index === index);

    if (isCurrentlySaved) {
      // Remove from Saved Solutions
      setSavedCards(prev => prev.filter(card => card.index !== index));

      try {
        const response = await fetch('/api/saved', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: angle.title,
            description: angle.description,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to remove saved card');
        }
      } catch (error) {
        console.error('Error removing saved card:', error);
        // Revert the UI state if the API call fails
        setSavedCards(prev => [...prev, { index }]);
      }
    } else {
      // Add to Saved Solutions
      setSavedCards(prev => [...prev, { index }]);

      try {
        const response = await fetch('/api/saved', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: angle.title,
            description: angle.description,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save card');
        }
      } catch (error) {
        console.error('Error saving card:', error);
        // Revert the UI state if the API call fails
        setSavedCards(prev => prev.filter(card => card.index !== index));
      }
    }
  };

  const handleResubmit = async () => {
    if (!formData || !onResubmit) return;
    
    setIsResubmitting(true);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const result = await response.json();
      onResubmit(result);
    } catch (error) {
      console.error('Error resubmitting:', error);
    } finally {
      setIsResubmitting(false);
    }
  };

  const handleAdjust = async () => {
    if (!adjustmentText.trim()) {
      setAdjustmentError('Please fill in the adjustments');
      return;
    }
    
    if (!entryId) {
      console.error('No entry ID provided');
      return;
    }

    setAdjustmentError(null);
    setIsResubmitting(true);
    try {
      const response = await fetch('/api/resubmit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: entryId,
          adjustments: adjustmentText 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const result = await response.json();
      if (onResubmit) {
        // First reset the saved state for all angles
        setSavedCards([]);
        // Then update with new angles
        onResubmit(result.result);
      }
      setShowAdjustment(false);
      setAdjustmentText('');
    } catch (error) {
      console.error('Error adjusting:', error);
    } finally {
      setIsResubmitting(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = async (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        // Only handle Enter if not in a textarea
        if (document.activeElement?.tagName !== 'TEXTAREA') {
          event.preventDefault();
          if (showAdjustment && !isResubmitting) {
            // Use the state value instead of querying the DOM
            if (adjustmentText.trim()) {
              handleAdjust();
            } else {
              setAdjustmentError('Please fill in the adjustments');
            }
          } else if (!showAdjustment && isMainPage) {
            // If adjustment form is not shown, show it when Enter is pressed
            setShowAdjustment(true);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showAdjustment, isMainPage, isResubmitting, adjustmentText]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!angles?.length) return null;

  return (
    <div className="mt-12 space-y-6">
      <h2 className={`text-gray-800 text-lg font-bold ${quicksand.className}`}>
        Based on your unique situation, here are some suggestions for how to approach the decision:
      </h2>
      <div className="space-y-6">
        {angles.map((angle, index) => (
          <div
            key={index}
            className={`bg-white/80 backdrop-blur rounded-lg p-6 shadow-sm ${
              isMainPage ? '' : 'hover:shadow-md transition-shadow cursor-pointer'
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-grow">
                <h3 className={`text-lg font-bold text-gray-800 mb-3 ${quicksand.className}`}>
                  {angle.title.replace(/\*\*/g, '')}
                </h3>
                <div className={`text-gray-700 space-y-4 ${inter.className}`}>
                  {angle.description.split('\n').map((paragraph, i) => {
                    // Skip empty paragraphs
                    if (!paragraph.trim()) return null;
                    
                    // Format the paragraph based on its content
                    let content = paragraph.trim();
                    let className = "text-gray-700";

                    if (content.startsWith("What It Is:")) {
                      className = "text-gray-900 font-medium";
                    } else if (content.startsWith("Why It Works:")) {
                      className = "text-gray-800";
                    } else if (content.startsWith("How to Try It:")) {
                      className = "text-teal-700";
                    }

                    return (
                      <p key={i} className={`${className} ${inter.className}`}>
                        {content}
                      </p>
                    );
                  })}
                </div>
              </div>
              {!isMainPage && (
                <button
                  onClick={(e) => handleSaveCard(angle, index, e)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                >
                  <BookmarkIcon isSaved={savedCards.some(card => card.index === index)} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isMainPage && (
        <div className="mt-8">
          {showAdjustment ? (
            <div className="space-y-4">
              <textarea
                value={adjustmentText}
                onChange={(e) => {
                  setAdjustmentText(e.target.value);
                  if (adjustmentError) setAdjustmentError(null);
                }}
                placeholder="What would you like to adjust about these suggestions? Be specific about what you'd like to see more or less of."
                className={`w-full p-4 rounded-xl border ${
                  adjustmentError ? 'border-red-400 bg-red-50' : 'border-gray-200'
                } focus:border-teal-600 h-[100px] focus:outline-none ${inter.className} text-gray-700 text-sm`}
              />
              {adjustmentError && (
                <p className="text-red-500 text-sm">{adjustmentError}</p>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAdjustment(false);
                    setAdjustmentText('');
                    setAdjustmentError(null);
                  }}
                  className={`px-4 py-2 rounded-full text-gray-600 bg-gray-100 text-sm ${plusJakarta.className} hover:bg-gray-200 transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdjust}
                  disabled={isResubmitting}
                  className={`bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-2 rounded-full hover:from-teal-600 hover:to-teal-700 ${plusJakarta.className} text-sm transition-all ${
                    isResubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isResubmitting ? 'Adjusting...' : 'Adjust'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className={`text-gray-500 text-sm mb-2 ${inter.className}`}>
                Want to adjust these suggestions?
              </p>
              <button
                onClick={() => setShowAdjustment(true)}
                className={`bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-2 rounded-full hover:from-teal-600 hover:to-teal-700 ${plusJakarta.className} text-sm transition-all`}
              >
                Customize Suggestions
              </button>
            </div>
          )}
        </div>
      )}

      {!isMainPage && (
        <div className="mt-8 text-center">
          <Link
            href="/"
            className={`inline-block bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-2 rounded-full hover:from-teal-600 hover:to-teal-700 ${plusJakarta.className} text-sm transition-all`}
          >
            Try Again
          </Link>
        </div>
      )}
    </div>
  );
};

export default EssayAngles;
