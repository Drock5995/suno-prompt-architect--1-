import React, { useState, useEffect, useRef } from 'react';
import { Song } from '../types';
import { PlayIcon, PauseIcon, VolumeIcon, VolumeMuteIcon, SkipBackIcon, SkipForwardIcon, ChevronDownIcon } from './icons/Icons';
import AudioVisualizer from './AudioVisualizer';

interface PlayerProps {
  song: Song;
  isPlaying: boolean;
  onTogglePlayPause: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  onNextSong?: () => void;
  onPreviousSong?: () => void;
  hasNextSong?: boolean;
  hasPreviousSong?: boolean;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

const Player: React.FC<PlayerProps> = ({ song, isPlaying, onTogglePlayPause, audioRef, onNextSong, onPreviousSong, hasNextSong, hasPreviousSong, isExpanded = false, onToggleExpanded }) => {
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentVersion, setCurrentVersion] = useState<'primary' | 'secondary'>('primary');
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [previousVolume, setPreviousVolume] = useState(1);
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Set up analyser with MediaElementSource
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setupAnalyser = async () => {
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
            const audioContext = new AudioContext();
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }
            const source = audioContext.createMediaElementSource(audio);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            analyser.connect(audioContext.destination);

            setAnalyser(analyser);
            audioContextRef.current = audioContext;
        };

        if (audio.readyState >= 2) {
            setupAnalyser();
        } else {
            audio.addEventListener('loadedmetadata', setupAnalyser);
        }

        return () => {
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, [song.id, currentVersion]);

    // Handle play/pause
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            if (audio.readyState >= 2) {
                audio.play().catch(e => console.error("Error playing audio:", e));
            } else {
                const onLoaded = () => {
                    audio.play().catch(e => console.error("Error playing audio:", e));
                    audio.removeEventListener('loadeddata', onLoaded);
                };
                audio.addEventListener('loadeddata', onLoaded);
            }
        } else {
            audio.pause();
        }
    }, [isPlaying, song.id, currentVersion]);

    // Update progress
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration);
            setProgress((audio.currentTime / audio.duration) * 100);
        };

        const handleTimeUpdate = () => updateProgress();
        audio.addEventListener('timeupdate', handleTimeUpdate);

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);

        updateProgress();

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [song.id, currentVersion]);

    // Update volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = (Number(e.target.value) / 100) * (audioRef.current?.duration || 0);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setProgress(Number(e.target.value));
        }
    }

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number(e.target.value) / 100;
        setVolume(newVolume);
        setPreviousVolume(newVolume);
        setIsMuted(false);
    }

    const toggleMute = () => {
        if (audioRef.current) {
            if (isMuted) {
                setIsMuted(false);
                audioRef.current.volume = previousVolume;
                setVolume(previousVolume);
            } else {
                setIsMuted(true);
                setPreviousVolume(volume);
                audioRef.current.volume = 0;
            }
        }
    }

    const skipBackward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
        }
    }

    const skipForward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10);
        }
    }

  return (
    <>
      {isExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col animate-slide-up">
          <div className="flex justify-center pt-8">
            <button
              type="button"
              onClick={onToggleExpanded}
              className="text-white hover:text-spotify-gray-100 transition-colors"
              aria-label="Collapse player"
              title="Collapse player"
            >
              <ChevronDownIcon size={32} />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <h2 className="text-2xl font-bold text-white mb-12">Now Playing</h2>
            <div className="my-12">
              <AudioVisualizer analyser={analyser} isPlaying={isPlaying} coverArtUrl={song.coverArtUrl} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{song.title}</h3>
            <p className="text-spotify-gray-100 mb-12">{song.artistStyle}</p>
            <div className="w-full max-w-md">
              <div className="flex items-center justify-center space-x-4 mb-4">
                {hasPreviousSong && (
                  <button onClick={onPreviousSong} className="text-white hover:text-spotify-gray-100 transition-colors" aria-label="Previous song" title="Previous Song">
                    <SkipBackIcon size={32} />
                  </button>
                )}
                <button onClick={skipBackward} className="text-white hover:text-spotify-gray-100 transition-colors" aria-label="Skip backward 10 seconds" title="Skip backward 10 seconds">
                  <SkipBackIcon size={24} />
                </button>
                <button onClick={onTogglePlayPause} className="bg-spotify-green text-black rounded-full p-4 hover:scale-105 transition-all" aria-label={isPlaying ? "Pause" : "Play"} title={isPlaying ? "Pause" : "Play"}>
                  {isPlaying ? <PauseIcon size={32} /> : <PlayIcon size={32} />}
                </button>
                <button onClick={skipForward} className="text-white hover:text-spotify-gray-100 transition-colors" aria-label="Skip forward 10 seconds" title="Skip forward 10 seconds">
                  <SkipForwardIcon size={24} />
                </button>
                {hasNextSong && (
                  <button onClick={onNextSong} className="text-white hover:text-spotify-gray-100 transition-colors" aria-label="Next song" title="Next Song">
                    <SkipForwardIcon size={32} />
                  </button>
                )}
              </div>
              {song.secondarySongUrl && (
                <div className="flex justify-center mb-4">
                  <button
                    onClick={() => setCurrentVersion(currentVersion === 'primary' ? 'secondary' : 'primary')}
                    className="bg-spotify-gray-300 text-white rounded-full p-2 hover:bg-spotify-gray-200 transition-all duration-200 hover:scale-105"
                    aria-label={`Switch to ${currentVersion === 'primary' ? 'Secondary' : 'Primary'} Version`}
                    title={`Switch to ${currentVersion === 'primary' ? 'Secondary' : 'Primary'} Version`}
                  >
                    {currentVersion === 'primary' ? '2' : '1'}
                  </button>
                </div>
              )}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-white">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  aria-label="Seek song progress"
                  title="Seek song progress"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleProgressChange}
                  className="w-full h-2 bg-spotify-gray-300 rounded-lg appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${progress}%, #535353 ${progress}%, #535353 100%)` }}
                />
                <span className="text-white">{formatTime(duration)}</span>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <button onClick={toggleMute} className="text-white hover:text-spotify-gray-100">
                  {isMuted ? <VolumeMuteIcon size={24} /> : <VolumeIcon size={24} />}
                </button>
                <input
                  type="range"
                  aria-label="Volume control"
                  title="Volume control"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume * 100}
                  onChange={handleVolumeChange}
                  className="w-32 h-1 bg-spotify-gray-300 rounded-lg appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${isMuted ? 0 : volume * 100}%, #535353 ${isMuted ? 0 : volume * 100}%, #535353 100%)` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <footer className="bg-gradient-to-r from-spotify-gray-500 to-spotify-gray-400 h-[90px] p-2 sm:p-4 flex items-center justify-between border-t border-spotify-gray-300 shadow-lg animate-slide-up">
      <audio key={`${song.id}-${currentVersion}`} ref={audioRef} src={currentVersion === 'primary' ? song.songUrl : song.secondarySongUrl || song.songUrl} crossOrigin="anonymous" preload="auto" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} />
      <div className="flex items-center space-x-2 sm:space-x-4 w-1/3 sm:w-1/4">
        <img src={song.coverArtUrl} alt={song.title} className="w-10 h-10 sm:w-14 sm:h-14 rounded-md flex-shrink-0 shadow-md cursor-pointer" onClick={onToggleExpanded} />
        <div className="overflow-hidden">
          <h4 className="font-semibold text-white truncate text-sm sm:text-base">{song.title}</h4>
          <p className="text-xs sm:text-sm text-spotify-gray-100 truncate">{song.artistStyle}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onPreviousSong}
          disabled={!hasPreviousSong}
          aria-label="Previous song"
          className="text-spotify-gray-100 hover:text-white transition-colors duration-200 hover:scale-110 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous Song"
        >
          <SkipBackIcon size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow max-w-2xl px-2">
        <div className="flex items-center space-x-2 mb-2">
          <button onClick={skipBackward} className="text-spotify-gray-100 hover:text-white transition-colors duration-200 hover:scale-110 p-1" aria-label="Skip backward 10 seconds">
            <SkipBackIcon size={20} />
          </button>
          <button onClick={onTogglePlayPause} className="bg-spotify-green text-black rounded-full p-3 hover:scale-105 transition-all duration-200 shadow-glow hover:shadow-glow-hover">
            {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
          </button>
          <button onClick={skipForward} className="text-spotify-gray-100 hover:text-white transition-colors duration-200 hover:scale-110 p-1" aria-label="Skip forward 10 seconds">
            <SkipForwardIcon size={20} />
          </button>
          <button
            onClick={onNextSong}
            disabled={!hasNextSong}
            aria-label="Next song"
            className="text-spotify-gray-100 hover:text-white transition-colors duration-200 hover:scale-110 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next Song"
          >
            <SkipForwardIcon size={20} />
          </button>
          {song.secondarySongUrl && (
            <button
              onClick={() => setCurrentVersion(currentVersion === 'primary' ? 'secondary' : 'primary')}
              className="bg-spotify-gray-300 text-white rounded-full p-2 hover:bg-spotify-gray-200 transition-all duration-200 hover:scale-105"
              title={`Switch to ${currentVersion === 'primary' ? 'Secondary' : 'Primary'} Version`}
            >
              {currentVersion === 'primary' ? '2' : '1'}
            </button>
          )}
        </div>
        <div className="w-full flex items-center space-x-2">
            <span className="text-xs text-spotify-gray-100 w-8 text-center">{formatTime(currentTime)}</span>
            <input
                type="range"
                aria-label="Seek song progress"
                title="Seek song progress"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="w-full h-2 bg-spotify-gray-300 rounded-lg appearance-none cursor-pointer slider-progress"
                style={{
                    background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${progress}%, #535353 ${progress}%, #535353 100%)`
                }}
            />
            <span className="text-xs text-spotify-gray-100 w-8 text-center">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 w-1/4 justify-end pr-4">
        <button onClick={toggleMute} className="text-spotify-gray-100 hover:text-white transition-colors duration-200 hover:scale-110" aria-label={isMuted ? "Unmute" : "Mute"}>
          {isMuted ? <VolumeMuteIcon size={20} /> : <VolumeIcon size={20} />}
        </button>
        <input
          type="range"
          aria-label="Volume control"
          title="Volume control"
          min="0"
          max="100"
          value={isMuted ? 0 : volume * 100}
          onChange={handleVolumeChange}
          className="w-20 h-1 bg-spotify-gray-300 rounded-lg appearance-none cursor-pointer slider-volume"
          style={{
              background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${isMuted ? 0 : volume * 100}%, #535353 ${isMuted ? 0 : volume * 100}%, #535353 100%)`
          }}
        />
      </div>
    </footer>
    </>
  );
};

export default Player;
