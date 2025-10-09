import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Song, View, Session } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PromptGenerator from './components/PromptGenerator';
import SongLibrary from './components/SongLibrary';
import SongUploader from './components/SongUploader';
import Player from './components/Player';
import Auth from './components/Auth';
import SettingsModal from './components/SettingsModal';
import PublicLibrary from './components/PublicLibrary';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  const [activeView, setActiveView] = useState<View>(View.LIBRARY);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoadingSongs, setIsLoadingSongs] = useState(true);
  const [publicSongs, setPublicSongs] = useState<Song[]>([]);
  const [isLoadingPublicSongs, setIsLoadingPublicSongs] = useState(true);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setIsLoadingSession(false);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === 'SIGNED_OUT') {
        setSongs([]);
        setCurrentSong(null);
        setIsPlaying(false);
        setActiveView(View.CREATE);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPublicSongs = async () => {
      setIsLoadingPublicSongs(true);
      try {
        const { data, error } = await supabase
          .from('songs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mappedSongs: Song[] = (data || []).map(s => ({
            id: s.id,
            title: s.title,
            artistStyle: s.artist_style,
            prompt: s.prompt,
            coverArtUrl: s.cover_art_url,
            songUrl: s.song_url,
            secondarySongUrl: s.secondary_song_url
        }));

        setPublicSongs(mappedSongs);
      } catch (error) {
        console.error("Error fetching public songs:", error);
      } finally {
        setIsLoadingPublicSongs(false);
      }
    };
    fetchPublicSongs();
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setIsLoadingSongs(false);
      return;
    };

    const fetchSongs = async () => {
      setIsLoadingSongs(true);
      try {
        const { data, error } = await supabase
          .from('songs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mappedSongs: Song[] = (data || []).map(s => ({
            id: s.id,
            title: s.title,
            artistStyle: s.artist_style,
            prompt: s.prompt,
            coverArtUrl: s.cover_art_url,
            songUrl: s.song_url,
            secondarySongUrl: s.secondary_song_url
        }));

        setSongs(mappedSongs);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setIsLoadingSongs(false);
      }
    };
    fetchSongs();
  }, [session]);

  const handleSaveSong = useCallback(async (data: { title: string; artistStyle: string; prompt: string; songFile: File; }) => {
    if (!session?.user) throw new Error("User not authenticated.");

    const { title, artistStyle, prompt, songFile } = data;

    const fileExt = songFile.name.split('.').pop();
    const filePath = `${session.user.id}/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('songs')
      .upload(filePath, songFile, { contentType: songFile.type });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from('songs').getPublicUrl(filePath);

    const newSongPayload = {
      title,
      artist_style: artistStyle,
      prompt,
      song_url: urlData.publicUrl,
      cover_art_url: `https://picsum.photos/seed/${crypto.randomUUID()}/400`,
      user_id: session.user.id,
    };

    const { data: newSongData, error: insertError } = await supabase
      .from('songs')
      .insert(newSongPayload)
      .select()
      .single();

    if (insertError) {
      await supabase.storage.from('songs').remove([filePath]);
      throw insertError;
    }

    const finalNewSong: Song = {
      id: newSongData.id,
      title: newSongData.title,
      artistStyle: newSongData.artist_style,
      prompt: newSongData.prompt,
      coverArtUrl: newSongData.cover_art_url,
      songUrl: newSongData.song_url
    };

    setSongs(prevSongs => [finalNewSong, ...prevSongs]);
    setActiveView(View.LIBRARY);
    setCurrentSong(finalNewSong);
    setIsSidebarOpen(false);
  }, [session]);

  const handleUploadSong = useCallback(async (data: { title: string; artistStyle: string; songFile: File; secondarySongFile?: File; }) => {
    if (!session?.user) throw new Error("User not authenticated.");

    const { title, artistStyle, songFile, secondarySongFile } = data;

    const fileExt = songFile.name.split('.').pop();
    const filePath = `${session.user.id}/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('songs')
      .upload(filePath, songFile, { contentType: songFile.type });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from('songs').getPublicUrl(filePath);

    let secondaryUrl: string | undefined;
    if (secondarySongFile) {
      const secondaryFileExt = secondarySongFile.name.split('.').pop();
      const secondaryFilePath = `${session.user.id}/${crypto.randomUUID()}.${secondaryFileExt}`;

      const { error: secondaryUploadError } = await supabase.storage
        .from('songs')
        .upload(secondaryFilePath, secondarySongFile, { contentType: secondarySongFile.type });

      if (secondaryUploadError) {
        await supabase.storage.from('songs').remove([filePath]);
        throw secondaryUploadError;
      }

      const { data: secondaryUrlData } = supabase.storage.from('songs').getPublicUrl(secondaryFilePath);
      secondaryUrl = secondaryUrlData.publicUrl;
    }

    const newSongPayload = {
      title,
      artist_style: artistStyle,
      prompt: 'Uploaded song',
      song_url: urlData.publicUrl,
      secondary_song_url: secondaryUrl,
      cover_art_url: `https://picsum.photos/seed/${crypto.randomUUID()}/400`,
      user_id: session.user.id,
    };

    console.log("session.user.id:", session.user.id);

    const { data: newSongData, error: insertError } = await supabase
      .from('songs')
      .insert(newSongPayload)
      .select()
      .single();

    if (insertError) {
      await supabase.storage.from('songs').remove([filePath]);
      if (secondaryUrl) {
        const secondaryPath = secondaryUrl.split('/').pop();
        if (secondaryPath) await supabase.storage.from('songs').remove([`${session.user.id}/${secondaryPath}`]);
      }
      throw insertError;
    }

    const finalNewSong: Song = {
      id: newSongData.id,
      title: newSongData.title,
      artistStyle: newSongData.artist_style,
      prompt: newSongData.prompt,
      coverArtUrl: newSongData.cover_art_url,
      songUrl: newSongData.song_url,
      secondarySongUrl: newSongData.secondary_song_url
    };

    setSongs(prevSongs => [finalNewSong, ...prevSongs]);
    setActiveView(View.LIBRARY);
    setCurrentSong(finalNewSong);
    setIsSidebarOpen(false);
  }, [session]);

  const handleDeleteSong = useCallback(async (songId: string) => {
    const songToDelete = songs.find(s => s.id === songId);
    if (!songToDelete) return;

    const { error: deleteDbError } = await supabase
      .from('songs')
      .delete()
      .eq('id', songId);

    if (deleteDbError) throw deleteDbError;

    const filesToDelete: string[] = [];

    try {
        const url = new URL(songToDelete.songUrl);
        // Path is after /object/public/songs/
        const filePathWithBucket = url.pathname.substring(url.pathname.indexOf('/songs/') + 1);
        const filePath = filePathWithBucket.substring(filePathWithBucket.indexOf('/') + 1);

        if (filePath) {
            filesToDelete.push(filePath);
        }
    } catch(e) {
        console.warn("Could not parse primary song URL for deletion.", e);
    }

    if (songToDelete.secondarySongUrl) {
      try {
          const secondaryUrl = new URL(songToDelete.secondarySongUrl);
          const secondaryFilePathWithBucket = secondaryUrl.pathname.substring(secondaryUrl.pathname.indexOf('/songs/') + 1);
          const secondaryFilePath = secondaryFilePathWithBucket.substring(secondaryFilePathWithBucket.indexOf('/') + 1);

          if (secondaryFilePath) {
              filesToDelete.push(secondaryFilePath);
          }
      } catch(e) {
          console.warn("Could not parse secondary song URL for deletion.", e);
      }
    }

    if (filesToDelete.length > 0) {
      try {
        await supabase.storage.from('songs').remove(filesToDelete);
      } catch(e) {
        console.warn("Could not delete some files from storage, but DB entry was removed.", e);
      }
    }

    setSongs(prevSongs => prevSongs.filter(s => s.id !== songId));
    if (currentSong?.id === songId) {
        setCurrentSong(null);
        setIsPlaying(false);
    }
  }, [songs, currentSong]);

  const handleSelectSong = useCallback((song: Song) => {
    if (currentSong?.id === song.id) {
        setIsPlaying(prev => !prev);
    } else {
        setCurrentSong(song);
        setIsPlaying(true);
    }
  }, [currentSong]);

  const handleTogglePlayPause = useCallback(() => setIsPlaying(prev => !prev), []);
  const handleViewChange = (view: View) => {
    setActiveView(view);
    setIsSidebarOpen(false);
  }

  const handleToggleSettingsModal = () => {
    setIsSettingsModalOpen(prev => !prev);
  }

  const handleSwapVersions = useCallback(async (songId: string) => {
    if (!session?.user) return;

    const song = songs.find(s => s.id === songId);
    if (!song || !song.secondarySongUrl) return;

    const newPrimary = song.secondarySongUrl;
    const newSecondary = song.songUrl;

    const { error } = await supabase
      .from('songs')
      .update({
        song_url: newPrimary,
        secondary_song_url: newSecondary
      })
      .eq('id', songId)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error swapping versions:', error);
      alert('Failed to swap versions.');
      return;
    }

    // Update local state
    setSongs(prevSongs => prevSongs.map(s =>
      s.id === songId
        ? { ...s, songUrl: newPrimary, secondarySongUrl: newSecondary }
        : s
    ));

    if (currentSong?.id === songId) {
      setCurrentSong({ ...currentSong, songUrl: newPrimary, secondarySongUrl: newSecondary });
    }
  }, [session, songs, currentSong]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && currentSong) {
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  const renderContent = () => {
    if (activeView === View.CREATE) {
      return <PromptGenerator onSaveSong={handleSaveSong} />;
    }
    if (activeView === View.LIBRARY) {
        if (isLoadingSongs) {
            return (
                <div className="p-8 text-center text-spotify-gray-100 flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spotify-green"></div>
                    <h2 className="text-2xl font-bold mt-4">Loading Library...</h2>
                </div>
            );
        }
        return (
            <SongLibrary
                songs={songs}
                onSelectSong={handleSelectSong}
                currentSong={currentSong}
                isPlaying={isPlaying}
                onDeleteSong={handleDeleteSong}
            />
        );
    }
    if (activeView === View.UPLOAD) {
      return <SongUploader onUploadSong={handleUploadSong} />;
    }
    return null;
  }

  if (isLoadingSession) {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-app-bg animate-fade-in">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spotify-green"></div>
        </div>
    );
  }

  if (showLogin) {
    return <Auth />;
  }

  if (!session) {
    return (
      <div className="h-screen w-screen flex flex-col bg-app-bg overflow-hidden">
        <PublicLibrary
          songs={publicSongs}
          onSelectSong={handleSelectSong}
          currentSong={currentSong}
          isPlaying={isPlaying}
          onLogin={() => setShowLogin(true)}
        />
        {currentSong && (
          <Player
            song={currentSong}
            isPlaying={isPlaying}
            onTogglePlayPause={handleTogglePlayPause}
            audioRef={audioRef}
            onSwapVersions={handleSwapVersions}
          />
        )}
      </div>
    );
  }

  return (
    <div className="h-screen w-screen text-spotify-gray-100 font-sans flex flex-col bg-app-bg overflow-hidden animate-fade-in">
      <div className="flex flex-grow h-[calc(100vh-90px)] relative">
        <Sidebar activeView={activeView} setActiveView={handleViewChange} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0">
            <Header onMenuClick={() => setIsSidebarOpen(true)} onSettingsClick={handleToggleSettingsModal} session={session} />
            <main className="flex-1 bg-spotify-gray-500 overflow-y-auto">
              {renderContent()}
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
          onSwapVersions={handleSwapVersions}
        />
      )}
      <SettingsModal isOpen={isSettingsModalOpen} onClose={handleToggleSettingsModal} />
    </div>
  );
};

export default App;
