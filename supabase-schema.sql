-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create neighborhoods table
CREATE TABLE neighborhoods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(100),
  color VARCHAR(7) DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create businesses table with SEO-optimized fields
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL DEFAULT 'Calgary',
  province VARCHAR(50) NOT NULL DEFAULT 'Alberta',
  postal_code VARCHAR(10) NOT NULL,
  phone VARCHAR(20),
  website VARCHAR(500),
  email VARCHAR(255),
  opening_date DATE NOT NULL,
  hours TEXT,
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  neighborhood_id UUID REFERENCES neighborhoods(id) ON DELETE SET NULL,
  verified BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  
  -- SEO fields
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  meta_keywords TEXT[] DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_category ON businesses(category_id);
CREATE INDEX idx_businesses_neighborhood ON businesses(neighborhood_id);
CREATE INDEX idx_businesses_opening_date ON businesses(opening_date DESC);
CREATE INDEX idx_businesses_featured ON businesses(featured) WHERE featured = TRUE;
CREATE INDEX idx_businesses_verified ON businesses(verified) WHERE verified = TRUE;
CREATE INDEX idx_businesses_active ON businesses(active) WHERE active = TRUE;
CREATE INDEX idx_businesses_location ON businesses(latitude, longitude);
-- Create text search indexes using trigram similarity
CREATE INDEX idx_businesses_name_gin ON businesses USING gin(name gin_trgm_ops);
CREATE INDEX idx_businesses_description_gin ON businesses USING gin(description gin_trgm_ops);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_neighborhoods_updated_at BEFORE UPDATE ON neighborhoods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO neighborhoods (name, slug, description) VALUES
('Downtown', 'downtown', 'Calgary''s vibrant downtown core with shopping, dining, and entertainment'),
('Beltline', 'beltline', 'Trendy neighborhood known for its nightlife and cultural scene'),
('Kensington', 'kensington', 'Eclectic neighborhood with unique shops and restaurants'),
('Inglewood', 'inglewood', 'Historic neighborhood with boutique shops and art galleries'),
('Mission', 'mission', 'Up-and-coming area with trendy cafes and restaurants'),
('17th Avenue', '17th-avenue', 'Popular shopping and dining district'),
('Stephen Avenue', 'stephen-avenue', 'Pedestrian mall with retail and dining options');

INSERT INTO categories (name, slug, description, icon, color) VALUES
('Restaurants & Cafes', 'restaurants-cafes', 'New dining establishments in Calgary', 'utensils', '#ef4444'),
('Retail & Shopping', 'retail-shopping', 'New retail stores and shopping destinations', 'shopping-bag', '#3b82f6'),
('Health & Wellness', 'health-wellness', 'Fitness centers, spas, and wellness services', 'heart', '#10b981'),
('Entertainment', 'entertainment', 'Bars, clubs, and entertainment venues', 'music', '#8b5cf6'),
('Professional Services', 'professional-services', 'Business services and professional offices', 'briefcase', '#f59e0b'),
('Beauty & Personal Care', 'beauty-personal-care', 'Salons, spas, and personal care services', 'scissors', '#ec4899'),
('Technology & Innovation', 'technology-innovation', 'Tech startups and innovative businesses', 'cpu', '#06b6d4');

-- Enable Row Level Security (RLS)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for businesses" ON businesses FOR SELECT USING (active = TRUE);
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (TRUE);
CREATE POLICY "Public read access for neighborhoods" ON neighborhoods FOR SELECT USING (TRUE);

-- Create policy for authenticated users to insert businesses (for future admin features)
CREATE POLICY "Authenticated users can insert businesses" ON businesses FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to update businesses
CREATE POLICY "Authenticated users can update businesses" ON businesses FOR UPDATE USING (auth.role() = 'authenticated');

-- Create views for common queries
CREATE VIEW featured_businesses AS
SELECT b.*, c.name as category_name, c.slug as category_slug, n.name as neighborhood_name, n.slug as neighborhood_slug
FROM businesses b
LEFT JOIN categories c ON b.category_id = c.id
LEFT JOIN neighborhoods n ON b.neighborhood_id = n.id
WHERE b.featured = TRUE AND b.active = TRUE
ORDER BY b.opening_date DESC;

CREATE VIEW recent_businesses AS
SELECT b.*, c.name as category_name, c.slug as category_slug, n.name as neighborhood_name, n.slug as neighborhood_slug
FROM businesses b
LEFT JOIN categories c ON b.category_id = c.id
LEFT JOIN neighborhoods n ON b.neighborhood_id = n.id
WHERE b.active = TRUE
ORDER BY b.opening_date DESC
LIMIT 50;
