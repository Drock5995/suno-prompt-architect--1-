-- Supabase Database Initialization Script for Suno Prompt Architect App

-- Enable UUID extension for unique IDs
create extension if not exists "uuid-ossp";

-- Users table (managed by Supabase Auth, but can add extra profile info if needed)
-- For now, rely on Supabase Auth users table

-- Songs table
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

-- Song Requests table
create table if not exists song_requests (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  artist text not null,
  description text,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Storage bucket for songs (should be created in Supabase Storage UI or via API)
-- Bucket name: songs
-- Public access: true (or as per your security requirements)

-- Indexes for performance
create index if not exists idx_songs_user_id on songs(user_id);
create index if not exists idx_songs_created_at on songs(created_at desc);
create index if not exists idx_song_requests_submitted_at on song_requests(submitted_at desc);

-- Policies (example: allow users to insert/select their own songs)
-- Enable Row Level Security
alter table songs enable row level security;
alter table song_requests enable row level security;

-- Policy for songs: users can insert/select/update/delete their own songs
create policy "Users can manage their songs" on songs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policy for song_requests: allow anyone to insert, allow select for admins only (adjust as needed)
create policy "Allow insert for song requests" on song_requests
  for insert
  with check (true);

create policy "Allow select for admins" on song_requests
  for select
  using (auth.role() = 'admin');
