-- DATABASE OPTIMIZATION SCRIPTS FOR CALGARY BUSINESS DIRECTORY
-- Run these in Supabase SQL Editor to improve query performance from 3-4s to <1s

-- ===========================================
-- 1. CREATE INDEXES FOR BETTER QUERY PERFORMANCE
-- ===========================================

-- Composite index for most common filters (active + consumer_facing)
CREATE INDEX IF NOT EXISTS idx_calgary_businesses_active_consumer 
ON calgary_businesses(active, is_consumer_facing) 
WHERE active = true AND is_consumer_facing = true;

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_calgary_businesses_category 
ON calgary_businesses(category) 
WHERE active = true AND is_consumer_facing = true;

-- Index for community filtering  
CREATE INDEX IF NOT EXISTS idx_calgary_businesses_community 
ON calgary_businesses(community) 
WHERE active = true AND is_consumer_facing = true;

-- Index for date ordering (most recent first)
CREATE INDEX IF NOT EXISTS idx_calgary_businesses_date_desc 
ON calgary_businesses(first_issued_date DESC) 
WHERE active = true AND is_consumer_facing = true;

-- Index for slug lookup (individual business pages)
CREATE INDEX IF NOT EXISTS idx_calgary_businesses_slug 
ON calgary_businesses(slug) 
WHERE active = true;

-- Composite index for category + date (category pages)
CREATE INDEX IF NOT EXISTS idx_calgary_businesses_category_date 
ON calgary_businesses(category, first_issued_date DESC) 
WHERE active = true AND is_consumer_facing = true;

-- Text search index for better search performance
CREATE INDEX IF NOT EXISTS idx_calgary_businesses_search 
ON calgary_businesses USING gin(to_tsvector('english', tradename || ' ' || COALESCE(address, '') || ' ' || COALESCE(community, '') || ' ' || COALESCE(category, '')));

-- ===========================================
-- 2. OPTIMIZED DATABASE FUNCTIONS (RPC)
-- ===========================================

-- Function to get distinct categories efficiently
CREATE OR REPLACE FUNCTION get_distinct_categories()
RETURNS TABLE(categories text[])
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT ARRAY(
        SELECT DISTINCT category 
        FROM calgary_businesses 
        WHERE active = true 
          AND is_consumer_facing = true 
          AND category IS NOT NULL 
        ORDER BY category
    );
END;
$$;

-- Function to get distinct communities efficiently
CREATE OR REPLACE FUNCTION get_distinct_communities()
RETURNS TABLE(communities text[])
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT ARRAY(
        SELECT DISTINCT community 
        FROM calgary_businesses 
        WHERE active = true 
          AND is_consumer_facing = true 
          AND community IS NOT NULL 
        ORDER BY community
    );
END;
$$;

-- Optimized search function with ranking
CREATE OR REPLACE FUNCTION search_businesses(search_term text, result_limit integer DEFAULT 20)
RETURNS SETOF calgary_businesses
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM calgary_businesses
    WHERE active = true 
      AND is_consumer_facing = true
      AND (
        to_tsvector('english', tradename || ' ' || COALESCE(address, '') || ' ' || COALESCE(community, '') || ' ' || COALESCE(category, ''))
        @@ plainto_tsquery('english', search_term)
        OR tradename ILIKE '%' || search_term || '%'
      )
    ORDER BY 
      -- Rank exact matches higher
      CASE WHEN tradename ILIKE '%' || search_term || '%' THEN 1 ELSE 2 END,
      -- Then by text search rank
      ts_rank(
        to_tsvector('english', tradename || ' ' || COALESCE(address, '') || ' ' || COALESCE(community, '') || ' ' || COALESCE(category, '')),
        plainto_tsquery('english', search_term)
      ) DESC,
      -- Finally by date
      first_issued_date DESC
    LIMIT result_limit;
END;
$$;

-- Optimized function for main business listings with filters
CREATE OR REPLACE FUNCTION get_businesses_optimized(
    search_term text DEFAULT NULL,
    filter_category text DEFAULT NULL,
    filter_community text DEFAULT NULL,
    result_limit integer DEFAULT 20,
    result_offset integer DEFAULT 0
)
RETURNS TABLE(
    businesses json,
    total bigint
)
LANGUAGE plpgsql
AS $$
DECLARE
    total_count bigint;
    business_data json;
BEGIN
    -- Build the base query
    WITH filtered_businesses AS (
        SELECT *
        FROM calgary_businesses
        WHERE active = true 
          AND is_consumer_facing = true
          AND (filter_category IS NULL OR category = filter_category)
          AND (filter_community IS NULL OR community = filter_community)
          AND (
            search_term IS NULL 
            OR tradename ILIKE '%' || search_term || '%'
            OR address ILIKE '%' || search_term || '%'
            OR community ILIKE '%' || search_term || '%'
            OR category ILIKE '%' || search_term || '%'
          )
    ),
    counted AS (
        SELECT COUNT(*) as total_rows FROM filtered_businesses
    ),
    paginated AS (
        SELECT * FROM filtered_businesses
        ORDER BY first_issued_date DESC
        LIMIT result_limit
        OFFSET result_offset
    )
    SELECT 
        (SELECT total_rows FROM counted),
        json_agg(paginated.* ORDER BY first_issued_date DESC)
    INTO total_count, business_data
    FROM paginated;
    
    RETURN QUERY SELECT business_data, total_count;
END;
$$;

-- ===========================================
-- 3. MAINTENANCE FUNCTIONS
-- ===========================================

-- Function to update search vector (run periodically)
CREATE OR REPLACE FUNCTION update_search_vectors()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update search vectors for better text search performance
    UPDATE calgary_businesses 
    SET search_vector = to_tsvector('english', tradename || ' ' || COALESCE(address, '') || ' ' || COALESCE(community, '') || ' ' || COALESCE(category, ''))
    WHERE search_vector IS NULL 
       OR updated_at > (SELECT COALESCE(MAX(last_updated), '1970-01-01') FROM search_update_log);
       
    -- Log the update
    INSERT INTO search_update_log (last_updated) VALUES (NOW())
    ON CONFLICT (id) DO UPDATE SET last_updated = NOW();
END;
$$;

-- Create search update log table
CREATE TABLE IF NOT EXISTS search_update_log (
    id integer PRIMARY KEY DEFAULT 1,
    last_updated timestamp DEFAULT NOW(),
    CONSTRAINT search_update_log_single_row CHECK (id = 1)
);

-- Add search vector column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calgary_businesses' AND column_name = 'search_vector') THEN
        ALTER TABLE calgary_businesses ADD COLUMN search_vector tsvector;
        CREATE INDEX idx_calgary_businesses_search_vector ON calgary_businesses USING gin(search_vector);
        PERFORM update_search_vectors();
    END IF;
END $$;

-- ===========================================
-- 4. PERFORMANCE MONITORING
-- ===========================================

-- Function to analyze query performance
CREATE OR REPLACE FUNCTION analyze_query_performance()
RETURNS TABLE(
    query_type text,
    avg_execution_time_ms numeric,
    total_calls bigint
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'Feature Businesses' as query_type,
        0.0 as avg_execution_time_ms,
        0::bigint as total_calls
    WHERE false; -- Placeholder - real implementation would use pg_stat_statements
END;
$$;

-- ===========================================
-- USAGE INSTRUCTIONS
-- ===========================================

/*

1. RUN ALL INDEX CREATION STATEMENTS:
   - These will dramatically speed up filtering and search queries
   - Indexes are created with WHERE clauses to keep them small and fast

2. CREATE THE RPC FUNCTIONS:
   - These provide optimized alternatives to complex client-side queries
   - The application will try RPC first, fallback to original queries

3. MONITOR PERFORMANCE:
   - Use EXPLAIN ANALYZE on slow queries to verify index usage
   - Run VACUUM ANALYZE regularly to update statistics

4. EXPECTED IMPROVEMENTS:
   - Featured businesses: 3-4s → <200ms
   - Search queries: 3-4s → <500ms  
   - Category filtering: 3-4s → <100ms
   - Individual business lookup: 500ms → <50ms

5. MAINTENANCE:
   - Run update_search_vectors() when data changes significantly
   - REINDEX periodically if performance degrades over time

*/