import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Song, View } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PromptGenerator from './components/PromptGenerator';
import SongLibrary from './components/SongLibrary';
import Player from './components/Player';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.CREATE);
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSaveSong = useCallback((song: Omit<Song, 'id' | 'coverArtUrl'>) => {
    const newSong: Song = {
      ...song,
      id: crypto.randomUUID(),
      coverArtUrl: `https://picsum.photos/seed/${crypto.randomUUID()}/400`,
    };
    setSongs(prevSongs => [...prevSongs, newSong]);
    setActiveView(View.LIBRARY);
    setCurrentSong(newSong);
    setIsSidebarOpen(false); // Close sidebar on navigation
  }, []);

  const handleSelectSong = useCallback((song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  }, []);

  const handleTogglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);
  
  const handleViewChange = (view: View) => {
    setActiveView(view);
    setIsSidebarOpen(false);
  }

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  // Clean up blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      songs.forEach(song => {
        if (song.songUrl.startsWith('blob:')) {
          URL.revokeObjectURL(song.songUrl);
        }
      });
    };
  }, [songs]);


  return (
    <div className="h-screen w-screen text-spotify-gray-100 font-sans flex flex-col bg-black overflow-hidden">
      <div className="flex flex-grow h-[calc(100vh-90px)] relative">
        <Sidebar activeView={activeView} setActiveView={handleViewChange} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col">
            <Header onMenuClick={() => setIsSidebarOpen(true)} />
            <main className="flex-1 bg-spotify-gray-500 overflow-y-auto">
              {activeView === View.CREATE && <PromptGenerator onSaveSong={handleSaveSong} />}
              {activeView === View.LIBRARY && <SongLibrary songs={songs} onSelectSong={handleSelectSong} currentSong={currentSong} isPlaying={isPlaying}/>}
            </main>
        </div>
        {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="absolute inset-0 bg-black bg-opacity-50 z-10 md:hidden"></div>}
      </div>
      {currentSong && (
        <Player 
          song={currentSong} 
          isPlaying={isPlaying} 
          onTogglePlayPause={handleTogglePlayPause} 
          audioRef={audioRef}
        />
      )}
    </div>
  );
};

export default App;