-- Storage policies for the 'songs' bucket to allow authenticated users to upload, view, and delete their own files

-- Allow authenticated users to upload files to the 'songs' bucket in their own folder
create policy "Allow authenticated users to upload songs" on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'songs' and auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to view files in the 'songs' bucket (for their own files or public)
create policy "Allow authenticated users to view songs" on storage.objects
  for select
  using (bucket_id = 'songs');

-- Allow authenticated users to update their own files in the 'songs' bucket
create policy "Allow authenticated users to update songs" on storage.objects
  for update
  to authenticated
  using (bucket_id = 'songs' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'songs' and auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own files in the 'songs' bucket
create policy "Allow authenticated users to delete songs" on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'songs' and auth.uid()::text = (storage.foldername(name))[1]);
