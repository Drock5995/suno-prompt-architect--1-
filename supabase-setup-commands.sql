-- Enable UUID extension for unique IDs
create extension if not exists "uuid-ossp";

-- Create indexes for performance on songs table
create index if not exists idx_songs_user_id on songs(user_id);
create index if not exists idx_songs_created_at on songs(created_at desc);

-- Create indexes for performance on song_requests table
create index if not exists idx_song_requests_submitted_at on song_requests(submitted_at desc);
