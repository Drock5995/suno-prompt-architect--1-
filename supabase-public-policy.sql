-- Enable public read access for songs table and storage bucket

-- Enable Row Level Security on songs table
alter table songs enable row level security;

-- Allow public SELECT on songs table
create policy "Allow public select on songs" on songs
  for select
  using (true);

-- Storage bucket 'songs' should be set to public in Supabase Storage UI or via API
-- This allows public read access to song files

-- Note: For security, restrict insert/update/delete to authenticated users only
create policy "Allow authenticated users to manage their songs" on songs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
