-- Create a storage bucket named 'songs' in Supabase Storage
-- Note: Supabase Storage buckets are usually created via the Supabase UI or API, not directly via SQL.
-- However, you can use the Supabase CLI or API to create the bucket.

-- Example using Supabase CLI (run in terminal):
-- supabase storage bucket create songs --public

-- Example using Supabase REST API:
POST /storage/v1/bucket
Body:
{
  "id": "songs",
  "name": "songs",
  "public": true
}

-- Please use the Supabase dashboard or CLI to create the 'songs' bucket with public access as needed.
