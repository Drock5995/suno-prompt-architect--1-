import React, { useState, useRef } from 'react';

interface SongUploaderProps {
  onUploadSong: (data: { title: string; artistStyle: string; songFile: File; secondarySongFile?: File; }) => Promise<void>;
}

const SongUploader: React.FC<SongUploaderProps> = ({ onUploadSong }) => {
  const [title, setTitle] = useState('');
  const [artistStyle, setArtistStyle] = useState('');
  const [songFile, setSongFile] = useState<File | null>(null);
  const [secondarySongFile, setSecondarySongFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!title || !artistStyle || !songFile) {
      setError('Please provide a Song Title, Artist Style, and select an audio file.');
      return;
    }
    setError('');
    setIsUploading(true);
    try {
      await onUploadSong({
        title,
        artistStyle,
        songFile,
        secondarySongFile: secondarySongFile || undefined,
      });
      // Reset form on successful upload
      setTitle('');
      setArtistStyle('');
      setSongFile(null);
      setSecondarySongFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (secondaryFileInputRef.current) {
        secondaryFileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Failed to upload song:", error);
      alert("Failed to upload song. Please check the console for more details.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 text-white space-y-6 sm:space-y-8 h-full">
      <h2 className="text-3xl sm:text-4xl font-bold">Upload Your Song</h2>

      <div className="bg-spotify-gray-400 p-4 sm:p-6 rounded-lg space-y-4 max-w-md mx-auto">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-spotify-gray-100">Song Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title of your song"
            className="w-full mt-1 p-2 bg-spotify-gray-300 border border-spotify-gray-200 rounded-md focus:ring-spotify-green focus:border-spotify-green"
          />
        </div>
        <div>
          <label htmlFor="artistStyle" className="block text-sm font-medium text-spotify-gray-100">Artist Style</label>
          <input
            id="artistStyle"
            type="text"
            value={artistStyle}
            onChange={(e) => setArtistStyle(e.target.value)}
            placeholder="e.g., Pop, Rock, Jazz"
            className="w-full mt-1 p-2 bg-spotify-gray-300 border border-spotify-gray-200 rounded-md focus:ring-spotify-green focus:border-spotify-green"
          />
        </div>
        <div>
          <label htmlFor="songFile" className="block text-sm font-medium text-spotify-gray-100">Select Primary Audio File</label>
          <input
            id="songFile"
            ref={fileInputRef}
            type="file"
            accept="audio/mpeg,audio/wav,audio/ogg"
            onChange={(e) => setSongFile(e.target.files ? e.target.files[0] : null)}
            className="w-full mt-1 text-sm text-spotify-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-spotify-gray-200 file:text-white hover:file:bg-spotify-gray-300 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="secondarySongFile" className="block text-sm font-medium text-spotify-gray-100">Select Secondary Audio File (Optional)</label>
          <input
            id="secondarySongFile"
            ref={secondaryFileInputRef}
            type="file"
            accept="audio/mpeg,audio/wav,audio/ogg"
            onChange={(e) => setSecondarySongFile(e.target.files ? e.target.files[0] : null)}
            className="w-full mt-1 text-sm text-spotify-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-spotify-gray-200 file:text-white hover:file:bg-spotify-gray-300 transition-colors"
          />
        </div>
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full flex items-center justify-center bg-spotify-green text-black font-bold py-3 px-4 rounded-full hover:bg-green-400 transition duration-300 disabled:bg-spotify-gray-200 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
          ) : (
            "Upload to Library"
          )}
        </button>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default SongUploader;
