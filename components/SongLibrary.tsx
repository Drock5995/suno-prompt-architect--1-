import React from 'react';
import { Song } from '../types';
import { PlayIcon, PauseIcon, MusicNoteIcon } from './icons/Icons';

interface SongLibraryProps {
  songs: Song[];
  onSelectSong: (song: Song) => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

const SongLibrary: React.FC<SongLibraryProps> = ({ songs, onSelectSong, currentSong, isPlaying }) => {
  if (songs.length === 0) {
    return (
      <div className="p-8 text-center text-spotify-gray-100 flex flex-col items-center justify-center h-full">
        <MusicNoteIcon />
        <h2 className="text-2xl sm:text-3xl font-bold mt-4">Your Library is Empty</h2>
        <p className="mt-2 text-base sm:text-lg">Create a new song to see it here.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 text-white">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">My Library</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {songs.map((song) => (
          <div 
            key={song.id} 
            className="bg-spotify-gray-400 p-4 rounded-lg group hover:bg-spotify-gray-300 transition-colors duration-300 cursor-pointer relative"
            onClick={() => onSelectSong(song)}
          >
            <div className="relative">
              <img src={song.coverArtUrl} alt={song.title} className="w-full h-auto aspect-square rounded-md object-cover"/>
              <button 
                className="absolute bottom-2 right-2 bg-spotify-green text-black rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-2 transition-all duration-300"
                onClick={(e) => {
                    e.stopPropagation();
                    onSelectSong(song);
                }}
              >
                {currentSong?.id === song.id && isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
            </div>
            <h3 className="text-base sm:text-lg font-semibold mt-4 truncate">{song.title}</h3>
            <p className="text-sm text-spotify-gray-100 truncate">{song.artistStyle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongLibrary;