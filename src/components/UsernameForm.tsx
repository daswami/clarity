import React, { useState } from 'react';
import { setUserSession } from '../utils/auth';
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

const inter = Inter({
  weight: ['400', '500'],
  subsets: ['latin'],
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: '600',
  subsets: ['latin'],
});

export default function UsernameForm({ onComplete }: { onComplete: () => void }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setUserSession(data.userId, username);
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`max-w-md mx-auto mt-8 p-8 bg-white/80 backdrop-blur rounded-xl shadow-sm ${inter.className}`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome to Clarity</h2>
      <p className="text-gray-600 mb-6">Choose a username to start your journey</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter a username"
          className="w-full p-4 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-teal-600"
          required
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 px-6 rounded-full hover:from-teal-600 hover:to-teal-700 ${plusJakarta.className} text-sm transition-all ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Creating...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
