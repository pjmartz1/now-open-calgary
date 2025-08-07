import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { BusinessModal } from './components/BusinessModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { FeatureListingModal } from './components/FeatureListingModal';
import { ClaimBusinessModal } from './components/ClaimBusinessModal';
import { AboutPage } from './components/AboutPage';
import { ForBusinessOwnersPage } from './components/ForBusinessOwnersPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { DiagnosticsPage } from './components/DiagnosticsPage';
import { 
  ImprovedHero, 
  EnhancedBusinessCard, 
  ImprovedFilterSidebar, 
  ImprovedSearchBar,
  MobileFilterDrawer
} from './components/ImprovedUI';
import { fetchNewBusinesses } from './services/calgaryAPI';
import { getActiveFeaturedBusinessIds, cleanupExpiredFeatures, addFeaturedBusiness } from './services/featuredBusinessService';
import { Business, FilterState } from './types/Business';
import { generatePageTitle, generatePageDescription, updatePageMeta } from './utils/seoUtils';

function App() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [featureModalBusiness, setFeatureModalBusiness] = useState<Business | null>(null);
  const [claimModalBusiness, setClaimModalBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'businesses' | 'for-owners' | 'about' | 'privacy' | 'terms' | 'diagnostics'>('businesses');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    community: '',
    businessType: '',
    dateRange: '90'
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Load featured businesses from storage
  const [featuredBusinessIds, setFeaturedBusinessIds] = useState<string[]>([]);

  useEffect(() => {
    loadBusinesses();
    loadFeaturedBusinesses();
    
    // Listen for navigation events from footer
    const handleNavigateEvent = (event: CustomEvent) => {
      handleNavigation(event.detail);
    };
    
    window.addEventListener('navigate', handleNavigateEvent as EventListener);
    
    return () => {
      window.removeEventListener('navigate', handleNavigateEvent as EventListener);
    };
  }, []);

  useEffect(() => {
    filterBusinesses();
  }, [businesses, filters]);

  // Update page meta tags when page changes
  useEffect(() => {
    const title = generatePageTitle(undefined, currentPage);
    const description = generatePageDescription(undefined, currentPage);
    updatePageMeta(title, description);
  }, [currentPage]);

  const loadBusinesses = async () => {
    setLoading(true);
    try {
      const data = await fetchNewBusinesses(90);
      
      // Mark businesses as featured based on storage
      const featuredIds = getActiveFeaturedBusinessIds();
      const businessesWithFeatures = data.map(business => ({
        ...business,
        featured: featuredIds.includes(business.id)
      }));
      
      setBusinesses(businessesWithFeatures);
      
      // Log API status for debugging
      if (businessesWithFeatures.length > 0) {
        console.log(`📊 Loaded ${businessesWithFeatures.length} businesses successfully`);
        console.log(`⭐ ${featuredIds.length} businesses are featured`);
      }
    } catch (error) {
      console.error('Failed to load businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedBusinesses = () => {
    // Clean up expired features first
    cleanupExpiredFeatures();
    // Load active featured business IDs
    const activeIds = getActiveFeaturedBusinessIds();
    setFeaturedBusinessIds(activeIds);
    console.log('📊 Loaded', activeIds.length, 'active featured businesses');
  };

  const filterBusinesses = () => {
    let filtered = [...businesses];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(business =>
        business.business_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        business.trade_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        business.business_type.toLowerCase().includes(filters.search.toLowerCase()) ||
        business.community.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Community filter
    if (filters.community) {
      filtered = filtered.filter(business => business.community === filters.community);
    }

    // Business type filter
    if (filters.businessType) {
      filtered = filtered.filter(business => business.business_type === filters.businessType);
    }

    // Date range filter
    if (filters.dateRange !== '90') {
      const days = parseInt(filters.dateRange);
      filtered = filtered.filter(business => business.days_old <= days);
    }

    // Sort: featured first, then by newest
    filtered.sort((a, b) => {
      const aFeatured = featuredBusinessIds.includes(a.id);
      const bFeatured = featuredBusinessIds.includes(b.id);
      
      if (aFeatured && !bFeatured) return -1;
      if (!aFeatured && bFeatured) return 1;
      
      return a.days_old - b.days_old;
    });

    setFilteredBusinesses(filtered);
  };





  const openBusinessModal = (business: Business) => {
    setSelectedBusiness(business);
  };

  const closeBusinessModal = () => {
    setSelectedBusiness(null);
  };

  const openFeatureModal = (business: Business) => {
    setFeatureModalBusiness(business);
  };

  const closeFeatureModal = () => {
    setFeatureModalBusiness(null);
  };

  const openClaimModal = (business: Business) => {
    setClaimModalBusiness(business);
  };

  const closeClaimModal = () => {
    setClaimModalBusiness(null);
  };

  const handleFeatureSuccess = (businessId: string, featureType: string) => {
    // Add the business to featured businesses storage
    const business = businesses.find(b => b.id === businessId);
    if (business) {
      addFeaturedBusiness(business, featureType as 'basic' | 'premium' | 'premium_plus');
      
      // Update the business in the list to show as featured
      setBusinesses(prev => prev.map(b => 
        b.id === businessId 
          ? { ...b, featured: true }
          : b
      ));
      
      // Reload featured business IDs
      loadFeaturedBusinesses();
    }
    closeFeatureModal();
  };

  const handleClaimSubmit = (claimData: any) => {
    console.log('Claim submitted:', claimData);
    // In production, this would send to your backend
  };

  const handleNavigation = (page: 'businesses' | 'for-owners' | 'about' | 'privacy' | 'terms' | 'diagnostics') => {
    setCurrentPage(page);
    // Close any open modals when navigating
    setSelectedBusiness(null);
    setFeatureModalBusiness(null);
    setClaimModalBusiness(null);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsOfServicePage />;
      case 'diagnostics':
        return <DiagnosticsPage />;
      case 'about':
        return <AboutPage />;
      case 'for-owners':
        return <ForBusinessOwnersPage onFeatureClick={() => setCurrentPage('businesses')} />;
      case 'businesses':
      default:
        return (
          <>
            {/* Hero Section */}
            <ImprovedHero />
            
            {/* Search Bar */}
            <ImprovedSearchBar filters={filters} setFilters={setFilters} />
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Mobile Filter Button */}
              <div className="lg:hidden flex justify-center mb-4">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="flex items-center gap-2 bg-white border-2 border-gray-200 px-6 py-3 rounded-lg font-semibold text-gray-700 hover:border-red-500 hover:text-red-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                  Filters ({filteredBusinesses.length} results)
                </button>
              </div>

              {/* Desktop Sidebar */}
              <div className="hidden lg:block lg:w-80 flex-shrink-0">
                <ImprovedFilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  businessCount={filteredBusinesses.length}
                />
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {/* Loading State */}
                {loading && (
                  <div className="flex justify-center items-center h-64">
                    <LoadingSpinner />
                  </div>
                )}

                {/* No Results */}
                {!loading && filteredBusinesses.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                  </div>
                )}

                {/* Business Grid */}
                {!loading && filteredBusinesses.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredBusinesses.map((business) => (
                      <EnhancedBusinessCard
                        key={business.id}
                        business={business}
                        onClick={() => openBusinessModal(business)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Filter Drawer */}
            <MobileFilterDrawer
              isOpen={mobileFilterOpen}
              onClose={() => setMobileFilterOpen(false)}
              filters={filters}
              setFilters={setFilters}
              businessCount={filteredBusinesses.length}
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={() => {}} 
        searchTerm=""
        currentPage={currentPage}
        onNavigate={handleNavigation}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentPage()}
      </main>

      <Footer />

      {/* Business Detail Modal */}
      {selectedBusiness && (
        <BusinessModal
          business={selectedBusiness}
          onClose={closeBusinessModal}
          onFeature={openFeatureModal}
          onClaim={openClaimModal}
          onReport={(business) => {
            console.log('Report issue for:', business.business_name);
            // In production, this would open a report form
          }}
        />
      )}

      {/* Feature Listing Modal */}
      {featureModalBusiness && (
        <FeatureListingModal
          business={featureModalBusiness}
          onClose={closeFeatureModal}
          onSuccess={handleFeatureSuccess}
        />
      )}

      {/* Claim Business Modal */}
      {claimModalBusiness && (
        <ClaimBusinessModal
          business={claimModalBusiness}
          onClose={closeClaimModal}
          onSubmit={handleClaimSubmit}
        />
      )}
    </div>
  );
}

export default App;