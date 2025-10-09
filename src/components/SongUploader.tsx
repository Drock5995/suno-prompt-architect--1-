import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './icons/Icons';
import { generateImagePrompt, generateImage } from '../services/imageService';

interface SongUploaderProps {
  onUploadSong: (data: { title: string; artistStyle: string; songFile: File; secondarySongFile?: File; imageFile?: File; }) => Promise<void>;
}

const SongUploader: React.FC<SongUploaderProps> = ({ onUploadSong }) => {
  const [title, setTitle] = useState('');
  const [artistStyle, setArtistStyle] = useState('');
  const [inspiredBy, setInspiredBy] = useState('');
  const [songFile, setSongFile] = useState<File | null>(null);
  const [secondarySongFile, setSecondarySongFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSecondaryDragOver, setIsSecondaryDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent, isSecondary: boolean = false) => {
    e.preventDefault();
    if (isSecondary) {
      setIsSecondaryDragOver(true);
    } else {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent, isSecondary: boolean = false) => {
    e.preventDefault();
    if (isSecondary) {
      setIsSecondaryDragOver(false);
    } else {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, isSecondary: boolean = false) => {
    e.preventDefault();
    if (isSecondary) {
      setIsSecondaryDragOver(false);
    } else {
      setIsDragOver(false);
    }

    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => file.type.startsWith('audio/'));

    if (audioFile) {
      if (isSecondary) {
        setSecondarySongFile(audioFile);
      } else {
        setSongFile(audioFile);
      }
    } else {
      setError('Please drop an audio file (MP3, WAV, or OGG).');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isSecondary: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isSecondary) {
        setSecondarySongFile(file);
      } else {
        setSongFile(file);
      }
    }
  };

  const handleUpload = async () => {
    if (!title || !artistStyle || !inspiredBy || !songFile) {
      setError('Please provide a Song Title, Artist Name, Inspired By, and select an audio file.');
      return;
    }
    setError('');
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      let imageFile: File | undefined;
      try {
        // Generate image for the uploaded song
        const imagePrompt = generateImagePrompt(title, artistStyle, `Inspired by ${inspiredBy}`, inspiredBy);
        const imageDataUrl = await generateImage(imagePrompt);
        const imageResponse = await fetch(imageDataUrl);
        const imageBlob = await imageResponse.blob();
        imageFile = new File([imageBlob], 'cover_art.png', { type: 'image/png' });
      } catch (imageError) {
        console.warn("Image generation failed, proceeding with default cover art:", imageError);
        // imageFile remains undefined, will use default
      }

      await onUploadSong({
        title,
        artistStyle,
        songFile,
        secondarySongFile: secondarySongFile || undefined,
        imageFile,
      });
      setUploadProgress(100);
      // Reset form on successful upload
      setTitle('');
      setArtistStyle('');
      setInspiredBy('');
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
      setUploadProgress(0);
      clearInterval(progressInterval);
    }
  };

  const FileDropZone: React.FC<{
    file: File | null;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    inputRef: React.RefObject<HTMLInputElement>;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    isDragOver: boolean;
  }> = ({ file, onDrop, onDragOver, onDragLeave, inputRef, onFileSelect, label, isDragOver }) => (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer ${
        isDragOver
          ? 'border-spotify-green bg-spotify-green/10 scale-105'
          : file
          ? 'border-spotify-green bg-spotify-gray-300'
          : 'border-spotify-gray-200 bg-spotify-gray-300 hover:border-spotify-gray-100'
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="audio/mpeg,audio/wav,audio/ogg"
        onChange={onFileSelect}
        className="hidden"
      />
      <UploadIcon className={`mx-auto mb-2 ${isDragOver ? 'text-spotify-green' : 'text-spotify-gray-100'}`} size={32} />
      {file ? (
        <div>
          <p className="text-spotify-green font-semibold">{file.name}</p>
          <p className="text-sm text-spotify-gray-100">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      ) : (
        <div>
          <p className="text-spotify-gray-100 font-medium">{label}</p>
          <p className="text-sm text-spotify-gray-200">Drop your file here or click to browse</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 sm:p-8 text-white space-y-6 sm:space-y-8 h-full animate-fade-in">
      <h2 className="text-3xl sm:text-4xl font-bold animate-slide-up">Upload Your Song</h2>

      <div className="bg-gradient-to-br from-spotify-gray-500 to-spotify-gray-400 p-6 sm:p-8 rounded-lg space-y-6 max-w-2xl mx-auto shadow-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-spotify-gray-100 mb-2">Song Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the title of your song"
              className="w-full p-3 bg-spotify-gray-300 border border-spotify-gray-200 rounded-md focus:ring-2 focus:ring-spotify-green focus:border-spotify-green transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="artistStyle" className="block text-sm font-medium text-spotify-gray-100 mb-2">Artist Name</label>
            <input
              id="artistStyle"
              type="text"
              value={artistStyle}
              onChange={(e) => setArtistStyle(e.target.value)}
              placeholder="e.g., The Synthwave Rebels"
              className="w-full p-3 bg-spotify-gray-300 border border-spotify-gray-200 rounded-md focus:ring-2 focus:ring-spotify-green focus:border-spotify-green transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="inspiredBy" className="block text-sm font-medium text-spotify-gray-100 mb-2">Inspired By</label>
            <input
              id="inspiredBy"
              type="text"
              value={inspiredBy}
              onChange={(e) => setInspiredBy(e.target.value)}
              placeholder="e.g., Daft Punk, Tame Impala"
              className="w-full p-3 bg-spotify-gray-300 border border-spotify-gray-200 rounded-md focus:ring-2 focus:ring-spotify-green focus:border-spotify-green transition-all duration-200"
            />
          </div>
        </div>

        <div className="space-y-4">
          <FileDropZone
            file={songFile}
            onDrop={(e) => handleDrop(e, false)}
            onDragOver={(e) => handleDragOver(e, false)}
            onDragLeave={(e) => handleDragLeave(e, false)}
            inputRef={fileInputRef}
            onFileSelect={(e) => handleFileSelect(e, false)}
            label="Primary Audio File"
            isDragOver={isDragOver}
          />

          <FileDropZone
            file={secondarySongFile}
            onDrop={(e) => handleDrop(e, true)}
            onDragOver={(e) => handleDragOver(e, true)}
            onDragLeave={(e) => handleDragLeave(e, true)}
            inputRef={secondaryFileInputRef}
            onFileSelect={(e) => handleFileSelect(e, true)}
            label="Secondary Audio File (Optional)"
            isDragOver={isSecondaryDragOver}
          />
        </div>

        {isUploading && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex justify-between text-sm text-spotify-gray-100">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-spotify-gray-300 rounded-full h-2">
              <div
                className="bg-spotify-green h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={isUploading || !title || !artistStyle || !inspiredBy || !songFile}
          className="w-full flex items-center justify-center bg-spotify-green text-black font-bold py-3 px-4 rounded-full hover:bg-green-400 transition-all duration-300 disabled:bg-spotify-gray-200 disabled:cursor-not-allowed hover:scale-105 shadow-lg"
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
          ) : (
            "Upload to Library"
          )}
        </button>
        {error && <p className="text-red-400 text-sm mt-2 animate-fade-in">{error}</p>}
      </div>
    </div>
  );
};

export default SongUploader;
