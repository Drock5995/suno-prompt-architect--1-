import React, { useState, useEffect } from 'react';
import { Song } from '../types';
import { PlayIcon, PauseIcon } from './icons/Icons';

interface PlayerProps {
  song: Song;
  isPlaying: boolean;
  onTogglePlayPause: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

const Player: React.FC<PlayerProps> = ({ song, isPlaying, onTogglePlayPause, audioRef }) => {
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / audio.duration) * 100 || 0);
        };
        const setAudioDuration = () => setDuration(audio.duration);

        // Reset progress for new song
        setProgress(0);
        setCurrentTime(0);
        setDuration(audio.duration || 0);

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', setAudioDuration);
        
        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', setAudioDuration);
        }
    }, [audioRef, song.id]); // Re-run effect when song ID changes

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const newTime = (Number(e.target.value) / 100) * duration;
        audio.currentTime = newTime;
        setProgress(Number(e.target.value));
    }


  return (
    <footer className="bg-spotify-gray-400 h-[90px] p-2 sm:p-4 flex items-center justify-between border-t border-spotify-gray-300">
      <audio ref={audioRef} src={song.songUrl} key={song.id} onEnded={onTogglePlayPause} />
      <div className="flex items-center space-x-2 sm:space-x-4 w-1/3 sm:w-1/4">
        <img src={song.coverArtUrl} alt={song.title} className="w-10 h-10 sm:w-14 sm:h-14 rounded-md flex-shrink-0" />
        <div className="overflow-hidden">
          <h4 className="font-semibold text-white truncate text-sm sm:text-base">{song.title}</h4>
          <p className="text-xs sm:text-sm text-spotify-gray-100 truncate">{song.artistStyle}</p>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center flex-grow max-w-2xl px-2">
        <button onClick={onTogglePlayPause} className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform">
          {isPlaying ? <PauseIcon size={28} /> : <PlayIcon size={28} />}
        </button>
        <div className="w-full flex items-center space-x-2 mt-2">
            <span className="text-xs text-spotify-gray-100 w-8 text-center">{formatTime(currentTime)}</span>
            <input 
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="w-full h-1 bg-spotify-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            />
            <span className="text-xs text-spotify-gray-100 w-8 text-center">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="hidden sm:block w-1/4">
        {/* Volume controls could go here */}
      </div>
    </footer>
  );
};

export default Player;
