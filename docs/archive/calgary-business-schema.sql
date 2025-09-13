-- Calgary Business Database Schema
-- This schema is designed for Calgary business license data

-- Create the main Calgary businesses table
CREATE TABLE calgary_businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  calgary_id TEXT NOT NULL UNIQUE, -- Original Calgary business license ID
  tradename TEXT NOT NULL,
  address TEXT NOT NULL,
  community TEXT,
  license_type TEXT NOT NULL,
  first_issued_date DATE NOT NULL,
  slug TEXT NOT NULL UNIQUE, -- SEO-friendly URL slug
  category TEXT, -- restaurants, retail, services, etc.
  is_consumer_facing BOOLEAN DEFAULT TRUE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  view_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create performance indexes
CREATE INDEX idx_calgary_businesses_calgary_id ON calgary_businesses(calgary_id);
CREATE INDEX idx_calgary_businesses_community ON calgary_businesses(community);
CREATE INDEX idx_calgary_businesses_category ON calgary_businesses(category);
CREATE INDEX idx_calgary_businesses_first_issued_date ON calgary_businesses(first_issued_date DESC);
CREATE INDEX idx_calgary_businesses_is_consumer_facing ON calgary_businesses(is_consumer_facing) WHERE is_consumer_facing = TRUE;
CREATE INDEX idx_calgary_businesses_slug ON calgary_businesses(slug);
CREATE INDEX idx_calgary_businesses_location ON calgary_businesses(latitude, longitude);
CREATE INDEX idx_calgary_businesses_active ON calgary_businesses(active) WHERE active = TRUE;

-- Create text search indexes for business name and address
CREATE INDEX idx_calgary_businesses_tradename_gin ON calgary_businesses USING gin(tradename gin_trgm_ops);
CREATE INDEX idx_calgary_businesses_address_gin ON calgary_businesses USING gin(address gin_trgm_ops);

-- Create updated_at trigger
CREATE TRIGGER update_calgary_businesses_updated_at 
  BEFORE UPDATE ON calgary_businesses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE calgary_businesses ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for active calgary businesses" 
  ON calgary_businesses FOR SELECT 
  USING (active = TRUE);

-- Create policy for authenticated users to insert/update (for future admin features)
CREATE POLICY "Authenticated users can insert calgary businesses" 
  ON calgary_businesses FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update calgary businesses" 
  ON calgary_businesses FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Create useful views for common queries
CREATE VIEW recent_calgary_businesses AS
SELECT 
  id,
  calgary_id,
  tradename,
  address,
  community,
  license_type,
  first_issued_date,
  slug,
  category,
  is_consumer_facing,
  latitude,
  longitude,
  view_count,
  created_at
FROM calgary_businesses 
WHERE active = TRUE AND is_consumer_facing = TRUE
ORDER BY first_issued_date DESC
LIMIT 100;

CREATE VIEW calgary_businesses_by_community AS
SELECT 
  community,
  COUNT(*) as business_count,
  COUNT(CASE WHEN first_issued_date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as recent_count
FROM calgary_businesses 
WHERE active = TRUE AND is_consumer_facing = TRUE
GROUP BY community
ORDER BY business_count DESC;

CREATE VIEW calgary_businesses_by_category AS
SELECT 
  category,
  COUNT(*) as business_count,
  COUNT(CASE WHEN first_issued_date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as recent_count
FROM calgary_businesses 
WHERE active = TRUE AND is_consumer_facing = TRUE
GROUP BY category
ORDER BY business_count DESC;