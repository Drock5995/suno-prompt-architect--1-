-- Enable public SELECT on songs table for unauthenticated users

-- Drop any conflicting select policies that restrict access
drop policy if exists "Users can view their songs" on songs;

-- Create a policy to allow public select on songs table
create policy "Allow public select on songs" on songs
  for select
  using (true);
