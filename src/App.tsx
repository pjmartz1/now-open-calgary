import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FilterSidebar } from './components/FilterSidebar';
import { BusinessCard } from './components/BusinessCard';
import { BusinessModal } from './components/BusinessModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { FeatureListingModal } from './components/FeatureListingModal';
import { ClaimBusinessModal } from './components/ClaimBusinessModal';
import { AboutPage } from './components/AboutPage';
import { ForBusinessOwnersPage } from './components/ForBusinessOwnersPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { TestingPage } from './components/TestingPage';
import { DiagnosticsPage } from './components/DiagnosticsPage';
import { fetchNewBusinesses } from './services/calgaryAPI';
import { Business, FilterState } from './types/Business';
import { generatePageTitle, generatePageDescription, updatePageMeta } from './utils/seoUtils';

function App() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [featureModalBusiness, setFeatureModalBusiness] = useState<Business | null>(null);
  const [claimModalBusiness, setClaimModalBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState<'businesses' | 'for-owners' | 'about' | 'privacy' | 'terms' | 'testing' | 'diagnostics'>('businesses');
  const [filters, setFilters] = useState<FilterState>({
    community: '',
    businessType: '',
    dateRange: '90'
  });

  // Mock featured business IDs (in production, this would come from database)
  const featuredBusinessIds = ['LIC-2024-001', 'LIC-2024-002', 'LIC-2024-003'];

  useEffect(() => {
    loadBusinesses();
    
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
  }, [businesses, searchTerm, filters]);

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
      setBusinesses(data);
      
      // Log API status for debugging
      if (data.length > 0) {
        console.log(`📊 Loaded ${data.length} businesses successfully`);
      }
    } catch (error) {
      console.error('Failed to load businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBusinesses = () => {
    let filtered = [...businesses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(business =>
        business.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.trade_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.business_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.community.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
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
    // Update business to be featured
    setBusinesses(prev => prev.map(business => 
      business.id === businessId 
        ? { ...business, featured: true, featureType }
        : business
    ));
    closeFeatureModal();
  };

  const handleClaimSubmit = (claimData: any) => {
    console.log('Claim submitted:', claimData);
    // In production, this would send to your backend
  };

  const handleNavigation = (page: 'businesses' | 'for-owners' | 'about' | 'privacy' | 'terms' | 'testing' | 'diagnostics') => {
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
      case 'testing':
        return <TestingPage />;
      case 'about':
        return <AboutPage />;
      case 'for-owners':
        return <ForBusinessOwnersPage onFeatureClick={() => setCurrentPage('businesses')} />;
      case 'businesses':
      default:
        return (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <FilterSidebar
                businesses={businesses}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Discover New Businesses in Calgary – Updated Daily
                </h1>
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                  Welcome to <strong>Now Open Calgary</strong>, your go-to source for discovering the newest businesses across our city. 
                  Whether you're looking for a fresh dining spot, a unique retail shop, or a local service that just opened, we've got you covered. 
                  Our listings are updated daily using official City of Calgary data, so you'll always know what's new in your neighbourhood.
                </p>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  New Businesses in Calgary
                </h2>
                <p className="text-gray-600">
                  {loading ? (
                    'Loading businesses...'
                  ) : (
                    `${filteredBusinesses.length} businesses found ${searchTerm ? `for "${searchTerm}"` : ''}`
                  )}
                </p>
              </div>

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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredBusinesses.map((business) => (
                    <BusinessCard
                      key={business.id}
                      business={business}
                      isFeatured={featuredBusinessIds.includes(business.id)}
                      onClick={() => openBusinessModal(business)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={handleSearch} 
        searchTerm={searchTerm}
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
          isFeatured={featuredBusinessIds.includes(selectedBusiness.id)}
          onClose={closeBusinessModal}
          onFeature={() => openFeatureModal(selectedBusiness)}
          onClaim={() => openClaimModal(selectedBusiness)}
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