import React from 'react';
import { Song } from '../types';
import { PlayIcon, PauseIcon, MusicNoteIcon, TrashIcon } from './icons/Icons';

interface SongLibraryProps {
  songs: Song[];
  onSelectSong: (song: Song) => void;
  currentSong: Song | null;
  isPlaying: boolean;
  onDeleteSong: (songId: string) => Promise<void>;
}

const SongLibrary: React.FC<SongLibraryProps> = ({ songs, onSelectSong, currentSong, isPlaying, onDeleteSong }) => {
  if (songs.length === 0) {
    return (
      <div className="p-8 text-center text-spotify-gray-100 flex flex-col items-center justify-center h-full">
        <MusicNoteIcon />
        <h2 className="text-2xl sm:text-3xl font-bold mt-4">Your Library is Empty</h2>
        <p className="mt-2 text-base sm:text-lg">Create a new song to see it here.</p>
      </div>
    );
  }

  const handleDelete = async (e: React.MouseEvent, songId: string, songTitle: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${songTitle}"? This action cannot be undone.`)) {
        try {
            await onDeleteSong(songId);
        } catch (error) {
            console.error("Failed to delete song:", error);
            alert("There was an error deleting the song. Please try again.");
        }
    }
  }

  return (
    <div className="p-4 sm:p-8 text-white">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">My Library</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {songs.map((song) => (
          <div 
            key={song.id} 
            className="bg-spotify-gray-400 p-4 rounded-lg group hover:bg-spotify-gray-300 transition-colors duration-300 cursor-pointer flex flex-col"
            onClick={() => onSelectSong(song)}
          >
            <div className="relative mb-4">
              <img src={song.coverArtUrl} alt={song.title} className="w-full h-auto aspect-square rounded-md object-cover"/>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
              <button 
                aria-label={currentSong?.id === song.id && isPlaying ? 'Pause' : 'Play'}
                className="absolute bottom-2 right-2 bg-spotify-green text-black rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-2 transition-all duration-300"
                onClick={(e) => {
                    e.stopPropagation();
                    onSelectSong(song);
                }}
              >
                {currentSong?.id === song.id && isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button
                aria-label="Delete song"
                title="Delete song"
                onClick={(e) => handleDelete(e, song.id, song.title)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90 transition-all duration-300 hover:bg-opacity-75 hover:bg-red-500"
              >
                <TrashIcon size={18} />
              </button>
            </div>
            <div className="flex-grow">
                <h3 className="text-base sm:text-lg font-semibold text-white truncate">{song.title}</h3>
                <p className="text-sm text-spotify-gray-100 truncate">{song.artistStyle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongLibrary;