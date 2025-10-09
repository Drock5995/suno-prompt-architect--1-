-- Create the songs table in Supabase
create table if not exists songs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  artist_style text not null,
  prompt text not null,
  cover_art_url text not null,
  song_url text not null,
  secondary_song_url text,
  lyric_video_url text,
  music_video_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table songs enable row level security;

-- Policy for songs: users can insert/select/update/delete their own songs
create policy "Users can manage their songs" on songs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
