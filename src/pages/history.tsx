import React, { useEffect, useState } from 'react';
import { Quicksand, Inter, Plus_Jakarta_Sans } from "next/font/google";
import Link from 'next/link';
import ResponseCard from '../components/ResponseCard';
import EssayAngles from '../components/EssayAngles';

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

interface HistoryEntry {
  id: number;
  title: string;
  insight: string;
  conetitle: string;
  conedesc: string;
  ctwotitle: string;
  ctwodesc: string;
  cthreetitle: string;
  cthreedesc: string;
  challenge: string;
  decision: string;
  decisionstars: number;
  emotion: string;
  emotionstars: number;
  today: string;
  todaystars: number;
  fear: string;
  fearstars: number;
  future: string;
  futurestars: number;
  friend: string;
  friendstars: number;
  assumption: string;
  assumptionstars: number;
  created_at: string;
}

export default function History() {
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history');
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }
        const { data } = await response.json();
        setHistoryEntries(data || []);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    try {
      const response = await fetch(`/api/history?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      setHistoryEntries(prev => prev.filter(entry => entry.id !== id));
      if (selectedEntry?.id === id) {
        setSelectedEntry(null);
      }
    } catch (err) {
      console.error('Error deleting entry:', err);
    }
  };

  const handleEntryClick = (entry: HistoryEntry) => {
    setSelectedEntry(entry);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York'
    }).replace(',', '');
  };

  const handleHistoryClick = () => {
    setSelectedEntry(null);
  };

  const renderSelectedEntry = () => {
    if (!selectedEntry) return null;

    const angles = [
      {
        title: selectedEntry.conetitle,
        description: selectedEntry.conedesc,
      },
      {
        title: selectedEntry.ctwotitle,
        description: selectedEntry.ctwodesc,
      },
      {
        title: selectedEntry.cthreetitle,
        description: selectedEntry.cthreedesc,
      }
    ];

    return (
      <div className="mt-8">
        <div className={`bg-gradient-to-r from-rose-50 via-amber-50 to-teal-50 rounded-3xl p-8 ${inter.className}`}>
          <div className="max-w-2xl mx-auto">
            <h2 className={`text-3xl font-bold text-gray-800 mb-6 text-center ${quicksand.className}`}>
              {selectedEntry.title}
            </h2>
            <div className="bg-white/80 backdrop-blur rounded-lg p-6 shadow-sm mb-8">
              <h3 className={`text-xl font-bold text-gray-800 mb-4 ${quicksand.className}`}>
                Psychological Insight
              </h3>
              <p className={`text-gray-700 ${inter.className}`}>
                {selectedEntry.insight}
              </p>
            </div>
            <div className="flex flex-col items-end gap-4 mt-8 mb-8">
              <ResponseCard
                initialText={selectedEntry.decision}
                initialRating={selectedEntry.decisionstars}
                showEditButton={false}
                editable={false}
              />
              <ResponseCard
                initialText={selectedEntry.emotion}
                initialRating={selectedEntry.emotionstars}
                showEditButton={false}
                editable={false}
              />
              <ResponseCard
                initialText={selectedEntry.today}
                initialRating={selectedEntry.todaystars}
                showEditButton={false}
                editable={false}
              />
              <ResponseCard
                initialText={selectedEntry.fear}
                initialRating={selectedEntry.fearstars}
                showEditButton={false}
                editable={false}
              />
              <ResponseCard
                initialText={selectedEntry.future}
                initialRating={selectedEntry.futurestars}
                showEditButton={false}
                editable={false}
              />
              <ResponseCard
                initialText={selectedEntry.friend}
                initialRating={selectedEntry.friendstars}
                showEditButton={false}
                editable={false}
              />
              <ResponseCard
                initialText={selectedEntry.assumption}
                initialRating={selectedEntry.assumptionstars}
                showEditButton={false}
                editable={false}
              />
            </div>

            <div className="mt-8">
              <h3 className={`text-xl font-bold text-gray-800 mb-4 ${quicksand.className}`}>
                Solutions & Approaches
              </h3>
              <EssayAngles
                angles={angles}
                isLoading={false}
                isMainPage={false}
                entryId={selectedEntry.id}
              />
            </div>

            <div className="mt-8 bg-white/80 backdrop-blur rounded-lg p-6 shadow-sm">
              <h3 className={`text-xl font-bold text-gray-800 mb-4 ${quicksand.className}`}>
                Your Challenge
              </h3>
              <p className={`text-gray-700 ${inter.className}`}>
                {selectedEntry.challenge}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHistoryList = () => (
    <div className="space-y-4">
      {historyEntries.map((entry) => (
        <div
          key={entry.id}
          onClick={() => handleEntryClick(entry)}
          className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`text-lg font-bold text-gray-800 mb-2 ${quicksand.className}`}>
                {entry.title}
              </h3>
              {/* <p className={`text-gray-600 mb-2 ${inter.className}`}>
                {entry.decision}
              </p> */}
              <p className={`text-sm text-gray-500 ${inter.className}`}>
                {formatDate(entry.created_at)}
              </p>
            </div>
            <button
              onClick={(e) => handleDelete(entry.id, e)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-red-500">{error}</div>;
    }

    if (!historyEntries || historyEntries.length === 0) {
      return (
        <div>
          <h1 className={`text-3xl font-bold text-gray-800 mb-8 ${quicksand.className}`}>
            History
          </h1>
          <p className={`text-gray-500 ${inter.className}`}>
            Your history will show up here. Start a conversation to get insights and solutions!
          </p>
        </div>
      );
    }
    
    return selectedEntry ? renderSelectedEntry() : renderHistoryList();
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
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
