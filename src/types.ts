import { Session, User } from '@supabase/supabase-js';

export interface Song {
  id: string;
  title: string;
  artistStyle: string;
  prompt: string;
  coverArtUrl: string;
  songUrl: string;
  secondarySongUrl?: string;
  lyricVideoUrl?: string;
  musicVideoUrl?: string;
}

export enum View {
    CREATE = 'CREATE',
    LIBRARY = 'LIBRARY',
    UPLOAD = 'UPLOAD'
}

export enum PublicView {
    HOME = 'HOME',
    LIBRARY = 'LIBRARY',
    REQUESTS = 'REQUESTS'
}

export interface SongRequest {
  id: string;
  title: string;
  artist: string;
  description?: string;
  submittedAt: string;
}

export type { Session, User };
