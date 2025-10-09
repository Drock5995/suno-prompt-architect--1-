-- Fix Row Level Security policies on songs table to allow inserts by authenticated users

-- Drop existing policy if exists
drop policy if exists "Users can manage their songs" on songs;

-- Create policy for select: users can view their own songs
create policy "Users can view their songs" on songs
  for select
  using (auth.uid() = user_id);

-- Create policy for update: users can update their own songs
create policy "Users can update their songs" on songs
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create policy for delete: users can delete their own songs
create policy "Users can delete their songs" on songs
  for delete
  using (auth.uid() = user_id);

-- Create separate policy for insert: allow authenticated users to insert with user_id = auth.uid()
create policy "Allow insert for authenticated users" on songs
  for insert
  with check (user_id = auth.uid());
