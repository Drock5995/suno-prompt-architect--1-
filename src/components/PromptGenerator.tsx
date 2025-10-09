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
  const [instrumental, setInstrumental] = useState(false);

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);
  const [isGeneratingSong, setIsGeneratingSong] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [songTitle, setSongTitle] = useState('');
  const [songFile, setSongFile] = useState<File | null>(null);
  const [batchSize, setBatchSize] = useState(1);
  const [isBatchMode, setIsBatchMode] = useState(false);

  const handleGeneratePrompt = useCallback(async () => {
    if (!songTitle || !artist || !vibe) {
      setError('Song Title, Artist Style and Vibe/Theme are required.');
      return;
    }
    setError('');
    setGeneratedPrompt('');
    setIsLoading(true);
    try {
      const prompt = await generateSunoPrompt(artist, vibe, lyrics);
      setGeneratedPrompt(prompt);
    } catch (err) {
      setError('Failed to generate prompt. See console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [songTitle, artist, vibe, lyrics]);

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
    if (!generatedPrompt) {
      setError('Please generate a prompt first.');
      return;
    }
    if (!songTitle) {
      setError('Please enter a song title before generating the song.');
      return;
    }
    setError('');
    setIsGeneratingSong(true);
    try {
      if (isBatchMode && batchSize > 1) {
        for (let i = 0; i < batchSize; i++) {
          const batchTitle = `${songTitle} #${i + 1}`;
          const styleOfMusic = `${artist} - ${vibe}`;
          const audioUrl = await generateSongWithSuno(batchTitle, styleOfMusic, instrumental, lyrics, generatedPrompt);
          const response = await fetch(audioUrl);
          const blob = await response.blob();
          const file = new File([blob], `suno_song_${i + 1}.mp3`, { type: 'audio/mpeg' });
          // For batch, you might want to save or handle files differently
          // Here we just set the last generated file
          setSongFile(file);
        }
      } else {
        const styleOfMusic = `${artist} - ${vibe}`;
        const audioUrl = await generateSongWithSuno(songTitle, styleOfMusic, instrumental, lyrics, generatedPrompt);
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        const file = new File([blob], 'suno_song.mp3', { type: 'audio/mpeg' });
        setSongFile(file);
      }
    } catch (err) {
      setError('Failed to generate song. Check your Suno API key in the settings.');
    } finally {
      setIsGeneratingSong(false);
    }
  }, [generatedPrompt, songTitle, artist, vibe, instrumental, lyrics, isBatchMode, batchSize]);

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
      setInstrumental(false);
    } catch (error) {
      console.error("Failed to save song:", error);
      alert("Failed to save song. Please check the console for more details.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="p-4 sm:p-8 text-white space-y-6 sm:space-y-8 animate-fade-in">
      <h2 className="text-3xl sm:text-4xl font-bold animate-slide-up">Create New Masterpiece</h2>

      {/* Step Indicators */}
      <div className="flex items-center justify-center space-x-4 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${songTitle && artist && vibe ? 'bg-spotify-green text-black shadow-glow' : 'bg-spotify-gray-300 text-spotify-gray-100'} font-bold text-sm transition-all duration-500 hover:scale-110`}>
          1
        </div>
        <div className={`h-2 w-20 ${generatedPrompt ? 'bg-spotify-green' : 'bg-spotify-gray-300'} transition-colors duration-500 rounded-full`}></div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${generatedPrompt ? 'bg-spotify-green text-black shadow-glow' : 'bg-spotify-gray-300 text-spotify-gray-100'} font-bold text-sm transition-all duration-500 hover:scale-110`}>
          2
        </div>
        <div className={`h-2 w-20 ${songFile ? 'bg-spotify-green' : 'bg-spotify-gray-300'} transition-colors duration-500 rounded-full`}></div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${songFile ? 'bg-spotify-green text-black shadow-glow' : 'bg-spotify-gray-300 text-spotify-gray-100'} font-bold text-sm transition-all duration-500 hover:scale-110`}>
          3
        </div>
      </div>
      <div className="flex justify-center space-x-8 text-sm text-spotify-gray-100 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <span className={`transition-colors duration-300 ${songTitle && artist && vibe ? 'text-spotify-green font-semibold' : ''}`}>Define Sound</span>
        <span className={`transition-colors duration-300 ${generatedPrompt ? 'text-spotify-green font-semibold' : ''}`}>Generate Prompt</span>
        <span className={`transition-colors duration-300 ${songFile ? 'text-spotify-green font-semibold' : ''}`}>Create & Save</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Step 1: Inputs */}
        <div className="bg-gradient-to-br from-spotify-gray-500 to-spotify-gray-400 p-4 sm:p-6 rounded-lg space-y-4 shadow-lg animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-lg sm:text-xl font-semibold mb-2 flex items-center space-x-2">
            <span className="flex items-center justify-center w-6 h-6 bg-spotify-green text-black rounded-full text-xs font-bold">1</span>
            <span>Define Your Sound</span>
          </h3>
          <div>
            <label htmlFor="songTitle" className="block text-sm font-medium text-spotify-gray-100">Song Title</label>
            <input
              id="songTitle"
              type="text"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              placeholder="Enter the title of your creation"
              className="w-full mt-1 p-3 bg-spotify-gray-300 border border-spotify-gray-200 rounded-md focus:ring-2 focus:ring-spotify-green focus:border-spotify-green transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="artist" className="block text-sm font-medium text-spotify-gray-100">Artist Style</label>
            <input
              id="artist"
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="e.g., Daft Punk, Tame Impala, Billie Eilish"
              className="w-full mt-1 p-3 bg-spotify-gray-300 border border-spotify-gray-200 rounded-md focus:ring-2 focus:ring-spotify-green focus:border-spotify-green transition-all duration-200"
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
              className="w-full mt-1 p-3 bg-spotify-gray-300 border border-spotify-gray-200 rounded-md focus:ring-2 focus:ring-spotify-green focus:border-spotify-green transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="instrumental" className="inline-flex items-center space-x-2 text-sm text-spotify-gray-100">
              <input
                id="instrumental"
                type="checkbox"
                checked={instrumental}
                onChange={(e) => setInstrumental(e.target.checked)}
                className="rounded border-spotify-gray-200 text-spotify-green focus:ring-spotify-green"
              />
              <span>Instrumental</span>
            </label>
          </div>
          <div>
            <label htmlFor="batchMode" className="inline-flex items-center space-x-2 text-sm text-spotify-gray-100">
              <input
                id="batchMode"
                type="checkbox"
                checked={isBatchMode}
                onChange={(e) => setIsBatchMode(e.target.checked)}
                className="rounded border-spotify-gray-200 text-spotify-green focus:ring-spotify-green"
              />
              <span>Batch Mode</span>
            </label>
          </div>
          {isBatchMode && (
            <div>
              <label htmlFor="batchSize" className="block text-sm font-medium text-spotify-gray-100">Batch Size</label>
              <input
                id="batchSize"
                type="number"
                min="1"
                max="10"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-full mt-1 p-3 bg-spotify-gray-300 border border-spotify-gray-200 rounded-md focus:ring-2 focus:ring-spotify-green focus:border-spotify-green transition-all duration-200"
              />
            </div>
          )}
          <div>
            <div className="flex justify-between items-center">
                <label htmlFor="lyrics" className="block text-sm font-medium text-spotify-gray-100">Lyrics (Optional)</label>
                <button
                    onClick={handleGenerateLyrics}
                    disabled={isGeneratingLyrics || !artist || !vibe}
                    className="flex items-center space-x-2 text-sm text-spotify-gray-100 hover:text-white disabled:text-spotify-gray-200 disabled:cursor-not-allowed transition-colors duration-200 hover:scale-105"
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
              className="w-full mt-1 p-3 bg-spotify-gray-300 border border-spotify-gray-200 rounded-md focus:ring-2 focus:ring-spotify-green focus:border-spotify-green transition-all duration-200"
              readOnly={isGeneratingLyrics}
            />
          </div>
          <button
            onClick={handleGeneratePrompt}
            disabled={isLoading || isGeneratingLyrics || !songTitle || !artist || !vibe}
            className="w-full flex items-center justify-center bg-spotify-green text-black font-bold py-3 px-4 rounded-full hover:bg-green-400 transition-all duration-300 disabled:bg-spotify-gray-200 disabled:cursor-not-allowed hover:scale-105 shadow-lg"
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
          {error && <p className="text-red-400 text-sm mt-2 animate-fade-in">{error}</p>}
        </div>

        {/* Step 2: Output and Save */}
        <div className="bg-gradient-to-br from-spotify-gray-500 to-spotify-gray-400 p-4 sm:p-6 rounded-lg space-y-4 flex flex-col shadow-lg animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-lg sm:text-xl font-semibold mb-2 flex items-center space-x-2">
            <span className="flex items-center justify-center w-6 h-6 bg-spotify-green text-black rounded-full text-xs font-bold">2</span>
            <span>Use & Save Your Song</span>
          </h3>
          <div className="flex-grow">
            <label htmlFor="generatedPrompt" className="block text-sm font-medium text-spotify-gray-100">Generated Suno Prompt</label>
            <textarea
              id="generatedPrompt"
              readOnly
              value={isLoading ? "Generating..." : generatedPrompt}
              rows={6}
              placeholder="Your detailed prompt will appear here..."
              className="w-full mt-1 p-3 bg-spotify-gray-300 border border-spotify-gray-200 rounded-md transition-all duration-200"
            />
          </div>
          {generatedPrompt && !isLoading && (
            <div className="space-y-4 border-t border-spotify-gray-300 pt-4 animate-fade-in">
              <button
                onClick={handleGenerateSong}
                disabled={isGeneratingSong || !generatedPrompt}
                className="w-full flex items-center justify-center bg-blue-500 text-white font-bold py-3 px-4 rounded-full hover:bg-blue-400 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed hover:scale-105 shadow-lg"
              >
                {isGeneratingSong ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Generate Song with Suno"
                )}
              </button>

              {songFile && (
                <>
                  <div className="animate-slide-up">
                    <label htmlFor="songTitle" className="block text-sm font-medium text-spotify-gray-100">Song Title</label>
                    <input
                      id="songTitle"
                      type="text"
                      value={songTitle}
                      onChange={(e) => setSongTitle(e.target.value)}
                      placeholder="Enter the title of your creation"
                      className="w-full mt-1 p-3 bg-spotify-gray-300 border border-spotify-gray-200 rounded-md focus:ring-2 focus:ring-spotify-green focus:border-spotify-green transition-all duration-200"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center bg-white text-black font-bold py-3 px-4 rounded-full hover:bg-gray-200 transition-all duration-300 disabled:bg-spotify-gray-200 disabled:cursor-not-allowed hover:scale-105 shadow-lg animate-pulse-subtle"
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
