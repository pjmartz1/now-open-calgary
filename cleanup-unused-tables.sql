-- Cleanup script to remove unused tables from the Now Open Calgary project
-- This script removes the old business schema tables that are no longer needed

-- Drop the old businesses table and its dependencies
DROP TABLE IF EXISTS businesses CASCADE;

-- Drop the old categories table and its dependencies  
DROP TABLE IF EXISTS categories CASCADE;

-- Drop the old neighborhoods table and its dependencies
DROP TABLE IF EXISTS neighborhoods CASCADE;

-- Drop any related views that might reference these tables
DROP VIEW IF EXISTS recent_businesses CASCADE;
DROP VIEW IF EXISTS businesses_by_category CASCADE;
DROP VIEW IF EXISTS businesses_by_neighborhood CASCADE;

-- Drop any related indexes that might exist
DROP INDEX IF EXISTS idx_businesses_slug CASCADE;
DROP INDEX IF EXISTS idx_businesses_category CASCADE;
DROP INDEX IF EXISTS idx_businesses_neighborhood CASCADE;
DROP INDEX IF EXISTS idx_businesses_opening_date CASCADE;
DROP INDEX IF EXISTS idx_businesses_featured CASCADE;
DROP INDEX IF EXISTS idx_businesses_verified CASCADE;
DROP INDEX IF EXISTS idx_businesses_active CASCADE;
DROP INDEX IF EXISTS idx_businesses_location CASCADE;
DROP INDEX IF EXISTS idx_businesses_name_gin CASCADE;
DROP INDEX IF EXISTS idx_businesses_description_gin CASCADE;

-- Drop any related triggers
DROP TRIGGER IF EXISTS update_businesses_updated_at ON businesses;
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_neighborhoods_updated_at ON neighborhoods;

-- Note: We keep the update_updated_at_column() function as it's used by calgary_businesses table
-- Note: We keep the uuid-ossp and pg_trgm extensions as they're used by calgary_businesses table

-- Verify that only the calgary_businesses table and its related objects remain
-- The following tables should remain:
-- - calgary_businesses (main table)
-- - recent_calgary_businesses (view)
-- - calgary_businesses_by_community (view)  
-- - calgary_businesses_by_category (view)


