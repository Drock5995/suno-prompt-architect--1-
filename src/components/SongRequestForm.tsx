import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const SongRequestForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist) {
      setMessage('Title and artist are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('song_requests')
        .insert({
          title,
          artist,
          description: description || null,
          submitted_at: new Date().toISOString(),
        });
      if (error) throw error;
      setMessage('Song request submitted successfully!');
      setTitle('');
      setArtist('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting request:', error);
      setMessage('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-app-bg via-spotify-gray-500 to-spotify-gray-400 text-white p-8 animate-fade-in overflow-y-auto">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Request a Song</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">Song Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-spotify-gray-500 border border-spotify-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-spotify-green"
              required
            />
          </div>
          <div>
            <label htmlFor="artist" className="block text-sm font-medium mb-2">Artist</label>
            <input
              type="text"
              id="artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full px-4 py-2 bg-spotify-gray-500 border border-spotify-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-spotify-green"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">Description (Optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-spotify-gray-500 border border-spotify-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-spotify-green"
              rows={4}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-spotify-green text-black font-bold py-3 px-6 rounded-full hover:bg-green-400 transition-all duration-300 hover:scale-105 shadow-glow disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-spotify-green">{message}</p>
        )}
      </div>
    </div>
  );
};

export default SongRequestForm;
