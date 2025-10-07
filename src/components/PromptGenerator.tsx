import React, { useState, useCallback } from 'react';
import { generateSunoPrompt, generateLyrics } from '../services/geminiService';
import { generateSong as generateSongWithSuno } from '../services/sunoService';
import { SparklesIcon, QuillIcon } from './icons/Icons';

interface PromptGeneratorProps {
  onSaveSong: (data: { title: string; artistStyle: string; prompt: string; songFile: File; }) => Promise<void>;
}

const PromptGenerator: React.FC<PromptGeneratorProps> = ({ onSaveSong }) => {
  const [artist, setArtist] = useState('');
  const [vibe, setVibe] = useState('');
  const [lyrics, setLyrics] = useState('');
  
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);
  const [isGeneratingSong, setIsGeneratingSong] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [songTitle, setSongTitle] = useState('');
  const [songFile, setSongFile] = useState<File | null>(null);

  const handleGeneratePrompt = useCallback(async () => {
    if (!artist || !vibe) {
      setError('Artist Style and Vibe/Theme are required.');
      return;
    }
    setError('');
    setIsLoading(true);
    setGeneratedPrompt('');
    try {
      const prompt = await generateSunoPrompt(artist, vibe, lyrics);
      setGeneratedPrompt(prompt);
    } catch (err) {
      setError('Failed to generate prompt. See console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [artist, vibe, lyrics]);

  const handleGenerateLyrics = useCallback(async () => {
    if (!artist || !vibe) {
      setError('Please provide an Artist Style and Vibe first.');
      return;
    }
    setError('');
    setIsGeneratingLyrics(true);
    setLyrics('Generating lyrics...');
    try {
      const generatedLyrics = await generateLyrics(artist, vibe);
      setLyrics(generatedLyrics);
    } catch (err) {
      setError('Failed to generate lyrics.');
      setLyrics(''); // Clear the loading message on error
    } finally {
      setIsGeneratingLyrics(false);
    }
  }, [artist, vibe]);

  const handleGenerateSong = useCallback(async () => {
    if (!generatedPrompt || !lyrics) {
      setError('Please generate a prompt and lyrics first.');
      return;
    }
    setError('');
    setIsGeneratingSong(true);
    try {
      const audioUrl = await generateSongWithSuno(generatedPrompt, lyrics);
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const file = new File([blob], 'suno_song.mp3', { type: 'audio/mpeg' });
      setSongFile(file);
    } catch (err) { 
      setError('Failed to generate song. Check your Suno API key in the settings.');
    } finally {
      setIsGeneratingSong(false);
    }
  }, [generatedPrompt, lyrics]);

  const handleSave = async () => {
    if (!songTitle || !songFile || !generatedPrompt) {
        alert('Please provide a Song Title, generate a song, and ensure a prompt has been generated.');
        return;
    }

    setIsSaving(true);
    try {
      await onSaveSong({
          title: songTitle,
          artistStyle: artist,
          prompt: generatedPrompt,
          songFile: songFile,
      });
      // Reset form on successful save
      setArtist('');
      setVibe('');
      setLyrics('');
      setGeneratedPrompt('');
      setSongTitle('');
      setSongFile(null);
    } catch (error) {
      console.error("Failed to save song:", error);
      alert("Failed to save song. Please check the console for more details.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="p-4 sm:p-8 text-white space-y-6 sm:space-y-8">
      <h2 className="text-3xl sm:text-4xl font-bold">Create New Masterpiece</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Step 1: Inputs */}
        <div className="bg-spotify-gray-400 p-4 sm:p-6 rounded-lg space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Step 1: Define Your Sound</h3>
          <div>
            <label htmlFor="artist" className="block text-sm font-medium text-spotify-gray-100">Artist Style</label>
            <input
              id="artist"
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="e.g., Daft Punk, Tame Impala, Billie Eilish"
              className="w-full mt-1 p-2 bg-spotify-gray-300 border border-spotify-gray-200 rounded-md focus:ring-spotify-green focus:border-spotify-green"
            />
          </div>
          <div>
            <label htmlFor="vibe" className="block text-sm font-medium text-spotify-gray-100">Vibe / Theme</label>
            <input
              id="vibe"
              type="text"
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              placeholder="e.g., Energetic futuristic dance track"
              className="w-full mt-1 p-2 bg-spotify-gray-300 border border-spotify-gray-200 rounded-md focus:ring-spotify-green focus:border-spotify-green"
            />
          </div>
          <div>
            <div className="flex justify-between items-center">
                <label htmlFor="lyrics" className="block text-sm font-medium text-spotify-gray-100">Lyrics (Optional)</label>
                <button
                    onClick={handleGenerateLyrics}
                    disabled={isGeneratingLyrics || !artist || !vibe}
                    className="flex items-center space-x-2 text-sm text-spotify-gray-100 hover:text-white disabled:text-spotify-gray-200 disabled:cursor-not-allowed transition-colors"
                    title={!artist || !vibe ? "Enter Artist and Vibe first" : "Generate lyrics with AI"}
                >
                    <QuillIcon />
                    <span>Generate</span>
                </button>
            </div>
            <textarea
              id="lyrics"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              rows={10}
              placeholder="Write your own structured lyrics here, or let our AI songwriter craft a full song for you."
              className="w-full mt-1 p-2 bg-spotify-gray-300 border border-spotify-gray-200 rounded-md focus:ring-spotify-green focus:border-spotify-green"
              readOnly={isGeneratingLyrics}
            />
          </div>
          <button
            onClick={handleGeneratePrompt}
            disabled={isLoading || isGeneratingLyrics}
            className="w-full flex items-center justify-center bg-spotify-green text-black font-bold py-3 px-4 rounded-full hover:bg-green-400 transition duration-300 disabled:bg-spotify-gray-200 disabled:cursor-not-allowed"
          >
            {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
            ) : (
                <>
                    <SparklesIcon />
                    <span className="ml-2">Generate Prompt</span>
                </>
            )}
          </button>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>

        {/* Step 2: Output and Save */}
        <div className="bg-spotify-gray-400 p-4 sm:p-6 rounded-lg space-y-4 flex flex-col">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Step 2: Use & Save Your Song</h3>
          <div className="flex-grow">
            <label htmlFor="generatedPrompt" className="block text-sm font-medium text-spotify-gray-100">Generated Suno Prompt</label>
            <textarea
              id="generatedPrompt"
              readOnly
              value={isLoading ? "Generating..." : generatedPrompt}
              rows={6}
              placeholder="Your detailed prompt will appear here..."
              className="w-full mt-1 p-2 bg-spotify-gray-300 border border-spotify-gray-200 rounded-md"
            />
          </div>
          {generatedPrompt && !isLoading && (
            <div className="space-y-4 border-t border-spotify-gray-300 pt-4">
              <button
                onClick={handleGenerateSong}
                disabled={isGeneratingSong || !generatedPrompt || !lyrics}
                className="w-full flex items-center justify-center bg-blue-500 text-white font-bold py-3 px-4 rounded-full hover:bg-blue-400 transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isGeneratingSong ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Generate Song with Suno"
                )}
              </button>

              {songFile && (
                <>
                  <div>
                    <label htmlFor="songTitle" className="block text-sm font-medium text-spotify-gray-100">Song Title</label>
                    <input
                      id="songTitle"
                      type="text"
                      value={songTitle}
                      onChange={(e) => setSongTitle(e.target.value)}
                      placeholder="Enter the title of your creation"
                      className="w-full mt-1 p-2 bg-spotify-gray-300 border border-spotify-gray-200 rounded-md focus:ring-spotify-green focus:border-spotify-green"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center bg-white text-black font-bold py-3 px-4 rounded-full hover:bg-gray-200 transition duration-300 disabled:bg-spotify-gray-200 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    ) : (
                        "Save to Library"
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptGenerator;