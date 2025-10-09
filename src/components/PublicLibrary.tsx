import React from 'react';
import { Song } from '../types';
import { PlayIcon, PauseIcon, MusicNoteIcon } from './icons/Icons';

interface PublicLibraryProps {
  songs: Song[];
  onSelectSong: (song: Song) => void;
  currentSong: Song | null;
  isPlaying: boolean;
  onLogin: () => void;
}

const PublicLibrary: React.FC<PublicLibraryProps> = ({ songs, onSelectSong, currentSong, isPlaying, onLogin }) => {
  if (songs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-app-bg via-spotify-gray-500 to-spotify-gray-400 text-spotify-gray-100 flex flex-col items-center justify-center animate-fade-in">
        <MusicNoteIcon size={80} />
        <h2 className="text-4xl sm:text-5xl font-bold mt-8 animate-slide-up">No Songs Yet</h2>
        <p className="mt-4 text-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>The admin is working on adding music. Check back soon!</p>
        <button
          onClick={onLogin}
          className="mt-8 bg-spotify-green text-black font-bold py-3 px-6 rounded-full hover:bg-green-400 transition-all duration-300 hover:scale-105 shadow-glow"
        >
          Admin Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-app-bg via-spotify-gray-500 to-spotify-gray-400 text-white animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10"></div>
        <div className="relative z-20 p-8 sm:p-16 text-center">
          <h1 className="text-5xl sm:text-7xl font-bold mb-4 animate-slide-up bg-gradient-to-r from-spotify-green to-blue-400 bg-clip-text text-transparent">
            Stream Music
          </h1>
          <p className="text-xl sm:text-2xl mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Discover and enjoy AI-generated masterpieces
          </p>
          <button
            onClick={onLogin}
            className="bg-spotify-green text-black font-bold py-3 px-6 rounded-full hover:bg-green-400 transition-all duration-300 hover:scale-105 shadow-glow animate-pulse-subtle"
          >
            Admin Access
          </button>
        </div>
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-spotify-green/20 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-blue-400/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-400/20 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Songs Grid */}
      <div className="p-8">
        <h2 className="text-4xl font-bold mb-8 animate-slide-up">Latest Tracks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
              </div>
              <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-white truncate group-hover:text-spotify-green transition-colors duration-300">{song.title}</h3>
                  <p className="text-sm text-spotify-gray-100 truncate group-hover:text-white transition-colors duration-300">{song.artistStyle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicLibrary;
