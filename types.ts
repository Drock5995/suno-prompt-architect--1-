
export interface Song {
  id: string;
  title: string;
  artistStyle: string;
  prompt: string;
  coverArtUrl: string;
  songUrl: string;
}

export enum View {
    CREATE = 'CREATE',
    LIBRARY = 'LIBRARY'
}
