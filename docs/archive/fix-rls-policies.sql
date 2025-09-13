-- Fix RLS policies for calgary_businesses table
-- This ensures anonymous users can read active businesses

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access for active calgary businesses" ON calgary_businesses;
DROP POLICY IF EXISTS "Authenticated users can insert calgary businesses" ON calgary_businesses;
DROP POLICY IF EXISTS "Authenticated users can update calgary businesses" ON calgary_businesses;

-- Create new policies with explicit anonymous access
-- Allow all users (including anonymous) to read active businesses
CREATE POLICY "Allow public read access" 
  ON calgary_businesses FOR SELECT 
  TO anon, authenticated
  USING (active = TRUE);

-- Allow only service role to insert/update (for data sync)
CREATE POLICY "Service role can insert calgary businesses" 
  ON calgary_businesses FOR INSERT 
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update calgary businesses" 
  ON calgary_businesses FOR UPDATE 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Verify RLS is enabled (should already be enabled)
ALTER TABLE calgary_businesses ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to anon role
GRANT SELECT ON calgary_businesses TO anon;
GRANT SELECT ON recent_calgary_businesses TO anon;
GRANT SELECT ON calgary_businesses_by_community TO anon;
GRANT SELECT ON calgary_businesses_by_category TO anon;