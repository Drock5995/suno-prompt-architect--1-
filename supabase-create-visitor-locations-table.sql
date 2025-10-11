-- Create visitor_locations table
CREATE TABLE IF NOT EXISTS visitor_locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE visitor_locations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (for public visitors)
CREATE POLICY "Allow public inserts" ON visitor_locations
    FOR INSERT
    WITH CHECK (true);

-- Create policy to allow admins to read all locations
CREATE POLICY "Allow authenticated users to read" ON visitor_locations
    FOR SELECT
    USING (auth.role() = 'authenticated');
