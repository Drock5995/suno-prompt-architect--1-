-- Create the song_requests table in Supabase
create table if not exists song_requests (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  artist text not null,
  description text,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table song_requests enable row level security;

-- Policy for song_requests: allow anyone to insert
create policy "Allow insert for song requests" on song_requests
  for insert
  with check (true);

-- Policy for song_requests: allow select for admins only
create policy "Allow select for admins" on song_requests
  for select
  using (auth.role() = 'admin');
