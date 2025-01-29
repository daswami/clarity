import React, { useEffect, useState } from 'react';
import { Quicksand, Inter, Plus_Jakarta_Sans } from "next/font/google";
import Link from 'next/link';
import BookmarkIcon from '../components/BookmarkIcon';

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

interface Card {
  id: number;
  title: string;
  description: string;
  tool: string;
  created_at: string;
}

export default function SavedCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('/api/cards');
        if (!response.ok) {
          throw new Error('Failed to fetch cards');
        }
        const { data } = await response.json();
        setCards(data || []);
      } catch (err) {
        console.error('Error fetching cards:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch cards');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, []);

  const handleUnsave = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const response = await fetch(`/api/cards?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete card');
      }

      setCards(prev => prev.filter(card => card.id !== id));
    } catch (err) {
      console.error('Error deleting card:', err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Menu Section */}
      <div className={`w-1/6 h-full bg-gradient-to-b from-rose-50 to-amber-50 flex flex-col items-start px-8 py-8 relative ${inter.className} border-r border-amber-100`}>
        <span className="absolute right-4 top-4 bg-teal-400/20 px-2 py-0.5 text-teal-700 text-sm rounded-full backdrop-blur-sm">
          AI
        </span>
        <h1 className={`text-gray-800 text-4xl mb-8 ${quicksand.className}`}>clarity</h1>
        <Link href="/" className="text-gray-700 hover:text-teal-700 text-lg mb-4 transition-colors">Home</Link>
        <Link href="/save" className="text-gray-700 hover:text-teal-700 text-lg mb-4 transition-colors">Saved Solutions</Link>
        <Link href="/history" className="text-gray-700 hover:text-teal-700 text-lg mb-4 transition-colors">History</Link>
        {/* <Link href="/" className="text-gray-700 hover:text-teal-700 text-lg mb-4 transition-colors">Tools</Link> */}
      </div>

      {/* Right Content Section */}
      <div className="w-5/6 h-screen overflow-auto bg-gradient-to-br from-rose-100 via-amber-50 to-teal-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl font-bold text-gray-800 mb-8 ${quicksand.className}`}>
            Saved Solutions
          </h1>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : cards.length === 0 ? (
            <p className={`text-gray-500  ${inter.className}`}>
              Your saved solutions will show up here. Save a solution by clicking the bookmark icon!
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm relative"
                >
                  <button className="absolute top-4 right-4"
                    onClick={(e) => handleUnsave(card.id, e)}
                  >
                    <BookmarkIcon
                      isSaved={true}
                      
                    />
                  </button>
                  <h3 className={`text-gray-800 font-bold mb-2 mt-1 ${quicksand.className}`}>
                    {card.title}
                  </h3>
                  <p className={`text-gray-600 mb-4 ${inter.className}`}>{card.description}</p>
                  {/* <div className="flex items-center">
                    <span className={`inline-block bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-sm ${plusJakarta.className}`}>
                      {card.tool}
                    </span>
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
