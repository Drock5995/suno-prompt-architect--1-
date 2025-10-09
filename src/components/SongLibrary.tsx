import React from 'react';
import { Song } from '../types';
import { PlayIcon, PauseIcon, MusicNoteIcon, TrashIcon } from './icons/Icons';

interface SongLibraryProps {
  songs: Song[];
  onSelectSong: (song: Song) => void;
  currentSong: Song | null;
  isPlaying: boolean;
  onDeleteSong?: (songId: string) => Promise<void>;
  isPublic?: boolean;
}

const SongLibrary: React.FC<SongLibraryProps> = ({ songs, onSelectSong, currentSong, isPlaying, onDeleteSong, isPublic = false }) => {
  if (songs.length === 0) {
    return (
      <div className="p-8 text-center text-spotify-gray-100 flex flex-col items-center justify-center h-full animate-fade-in">
        <MusicNoteIcon />
        <h2 className="text-2xl sm:text-3xl font-bold mt-4 animate-slide-up">Your Library is Empty</h2>
        <p className="mt-2 text-base sm:text-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>Create a new song to see it here.</p>
      </div>
    );
  }

  const handleDelete = async (e: React.MouseEvent, songId: string, songTitle: string) => {
    e.stopPropagation();
    if (!onDeleteSong) return;
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
    <div className="p-4 sm:p-8 text-white animate-fade-in">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 animate-slide-up">{isPublic ? 'Public Library' : 'My Library'}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {songs.map((song, index) => (
          <div
            key={song.id}
            className="bg-gradient-to-br from-spotify-gray-500 to-spotify-gray-400 p-4 rounded-lg group hover:from-spotify-gray-400 hover:to-spotify-gray-300 transition-all duration-500 cursor-pointer flex flex-col shadow-lg hover:shadow-xl hover:scale-105 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => onSelectSong(song)}
          >
            <div className="relative mb-4 overflow-hidden rounded-md">
              <img src={song.coverArtUrl} alt={song.title} className="w-full h-auto aspect-square rounded-md object-cover transition-transform duration-500 group-hover:scale-110"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button
                aria-label={currentSong?.id === song.id && isPlaying ? 'Pause' : 'Play'}
                className="absolute bottom-3 right-3 bg-spotify-green text-black rounded-full p-3 shadow-glow opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-2 transition-all duration-500 hover:scale-110"
                onClick={(e) => {
                    e.stopPropagation();
                    onSelectSong(song);
                }}
              >
                {currentSong?.id === song.id && isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
              {!isPublic && (
                <button
                  aria-label="Delete song"
                  title="Delete song"
                  onClick={(e) => handleDelete(e, song.id, song.title)}
                  className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90 transition-all duration-300 hover:bg-red-500 hover:shadow-red-glow"
                >
                  <TrashIcon size={18} />
                </button>
              )}
            </div>
            <div className="flex-grow">
                <h3 className="text-base sm:text-lg font-semibold text-white truncate group-hover:text-spotify-green transition-colors duration-300">{song.title}</h3>
                <p className="text-sm text-spotify-gray-100 truncate group-hover:text-white transition-colors duration-300">{song.artistStyle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongLibrary;
