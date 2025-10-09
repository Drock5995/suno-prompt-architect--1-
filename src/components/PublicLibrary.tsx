import React from 'react';
import { Song, PublicView } from '../types';
import { PlayIcon, PauseIcon, MusicNoteIcon } from './icons/Icons';
import SongRequestForm from './SongRequestForm';
import logo from '../../generated-image (3).png';

interface PublicLibraryProps {
  songs: Song[];
  onSelectSong: (song: Song) => void;
  currentSong: Song | null;
  isPlaying: boolean;
  onLogin: () => void;
  publicView: PublicView;
  onPublicViewChange: (view: PublicView) => void;
  loginButtonText?: string;
}

const PublicLibrary: React.FC<PublicLibraryProps> = ({
  songs,
  onSelectSong,
  currentSong,
  isPlaying,
  onLogin,
  publicView,
  onPublicViewChange,
  loginButtonText,
}) => {
  if (publicView === PublicView.HOME) {
    return (
      <div className="min-h-screen bg-black text-white p-8 animate-fade-in overflow-y-auto flex flex-col items-center relative">
        {/* Neon accent glows background */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/20 rounded-full blur-3xl animate-pulse shadow-neon-green"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl animate-pulse shadow-neon-cyan" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-700/10 rounded-full blur-3xl animate-pulse shadow-neon-purple" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 text-center mb-16">
          <h1 className="text-8xl font-bold mb-4 tracking-tight text-white font-futuristic logo-text-container">
            <img src={logo} alt="SUNOFY Logo" className="green-s object-contain drop-shadow-neon-green" />
            <span className="tracking-wide text-white">UNOFY</span>
          </h1>
          <p className="text-xl sm:text-2xl text-neon-green animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Discover. Listen. Request.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 sm:gap-12 relative z-10">
          <button
            onClick={() => onPublicViewChange(PublicView.LIBRARY)}
            className="flex flex-col items-center space-y-4 cursor-pointer group perspective"
          >
            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-neon-green to-green-700 rounded-3xl shadow-neon-green flex items-center justify-center hover:scale-110 transition-all duration-300 group-hover:shadow-neon-green-hover relative overflow-hidden transform-style-preserve-3d animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-green-300/20 to-transparent rounded-3xl translate-z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl translate-z-15"></div>
              <MusicNoteIcon size={56} className="relative z-10 text-white drop-shadow-lg translate-z-20" />
              <div className="absolute inset-0 bg-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-z-30"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl translate-z-25 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-lg sm:text-xl font-semibold text-neon-green group-hover:text-green-400 transition-colors duration-300">Song Library</span>
          </button>
          <button
            onClick={() => onPublicViewChange(PublicView.REQUESTS)}
            className="flex flex-col items-center space-y-4 cursor-pointer group perspective"
          >
            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-neon-blue to-blue-700 rounded-3xl shadow-neon-blue flex items-center justify-center hover:scale-110 transition-all duration-300 group-hover:shadow-neon-blue-hover relative overflow-hidden transform-style-preserve-3d animate-float delay-200">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 to-transparent rounded-3xl translate-z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl translate-z-15"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-14 w-14 sm:h-16 sm:w-16 text-white relative z-10 drop-shadow-lg translate-z-20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l5 5v9a2 2 0 01-2 2z" />
              </svg>
              <div className="absolute inset-0 bg-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-z-30"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl translate-z-25 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-lg sm:text-xl font-semibold text-neon-blue group-hover:text-blue-400 transition-colors duration-300">Song Requests</span>
          </button>
          <button
            onClick={onLogin}
            className="flex flex-col items-center space-y-4 cursor-pointer group perspective"
          >
            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-onyx to-gray-900 rounded-3xl shadow-onyx flex items-center justify-center hover:scale-110 transition-all duration-300 group-hover:shadow-onyx-hover relative overflow-hidden transform-style-preserve-3d animate-float delay-400">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-transparent rounded-3xl translate-z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl translate-z-15"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-14 w-14 sm:h-16 sm:w-16 text-white relative z-10 drop-shadow-lg translate-z-20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.75 6.879 2.034M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7m0 0H9m3 0h3" />
              </svg>
              <div className="absolute inset-0 bg-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-z-30"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl translate-z-25 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-lg sm:text-xl font-semibold text-white group-hover:text-gray-400 transition-colors duration-300">{loginButtonText || "Admin Login"}</span>
          </button>
        </div>

        <div className="mt-16 text-center relative z-10">
          <p className="text-gray-400 text-sm animate-fade-in" style={{ animationDelay: '1s' }}>
            Tap an icon to explore
          </p>
        </div>
      </div>
    );
  }

  if (publicView === PublicView.LIBRARY) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-app-bg via-spotify-gray-500 to-spotify-gray-400 text-white animate-fade-in overflow-y-auto p-8">
        <button
          onClick={() => onPublicViewChange(PublicView.HOME)}
          className="mb-6 flex items-center space-x-2 text-spotify-green hover:text-green-400 cursor-pointer"
        >
          {/* Back arrow icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
        <h2 className="text-4xl font-bold mb-8">Song Library</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className="bg-gradient-to-br from-spotify-gray-500 to-spotify-gray-400 p-4 rounded-lg group hover:from-spotify-gray-400 hover:to-spotify-gray-300 transition-all duration-500 cursor-pointer flex flex-col shadow-lg hover:shadow-xl hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => onSelectSong(song)}
            >
              <div className="relative mb-4 overflow-hidden rounded-md">
                <img src={song.coverArtUrl} alt={song.title} className="w-full h-auto aspect-square rounded-md object-cover transition-transform duration-500 group-hover:scale-110" />
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
              <div className="flex space-x-2 mt-2">
                {song.lyricVideoUrl && (
                  <a
                    href={song.lyricVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-blue-600 rounded text-sm font-semibold hover:bg-blue-700 transition"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Lyric Video
                  </a>
                )}
                {song.musicVideoUrl && (
                  <a
                    href={song.musicVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-purple-600 rounded text-sm font-semibold hover:bg-purple-700 transition"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Music Video
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (publicView === PublicView.REQUESTS) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-app-bg via-spotify-gray-500 to-spotify-gray-400 text-white animate-fade-in overflow-y-auto p-8">
        <button
          onClick={() => onPublicViewChange(PublicView.HOME)}
          className="mb-6 flex items-center space-x-2 text-spotify-green hover:text-green-400 cursor-pointer"
        >
          {/* Back arrow icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
        <SongRequestForm />
      </div>
    );
  }

  // Fallback: show loading or empty state
  return (
    <div className="min-h-screen bg-gradient-to-br from-app-bg via-spotify-gray-500 to-spotify-gray-400 text-spotify-gray-100 flex flex-col items-center justify-center animate-fade-in overflow-y-auto">
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
};

export default PublicLibrary;
