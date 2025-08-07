
import { Search, MapPin, Calendar, Filter, Star, ExternalLink, Building2, Zap, TrendingUp, Eye, Users } from 'lucide-react';
import { Business } from '../types/Business';

// Improved Hero Section with better visual hierarchy
export const ImprovedHero = () => (
  <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Zap className="h-10 w-10 text-yellow-300" />
          <h1 className="text-4xl md:text-5xl font-bold">
            Who's New in Calgary
          </h1>
        </div>
        <p className="text-xl text-red-100 mb-6 max-w-2xl mx-auto">
          Discover Calgary's newest businesses as they open their doors. 
          Never miss the hottest new spots in your neighborhood.
        </p>
        
        {/* Quick Stats */}
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-yellow-300" />
            <span>342 new businesses this month</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-yellow-300" />
            <span>Updated daily at 6 AM</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-yellow-300" />
            <span>12,000+ Calgarians discovering</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Business Card with better visual appeal
interface EnhancedBusinessCardProps {
  business: Business;
  onClick: () => void;
}

export const EnhancedBusinessCard: React.FC<EnhancedBusinessCardProps> = ({ business, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysOldLabel = (days: number) => {
    if (days <= 7) return { 
      label: 'Just opened!', 
      color: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
      pulse: true
    };
    if (days <= 14) return { 
      label: 'New this month', 
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
      pulse: false
    };
    if (days <= 30) return { 
      label: 'Recently opened', 
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
      pulse: false
    };
    return { 
      label: `${days} days ago`, 
      color: 'bg-gray-100 text-gray-600',
      pulse: false
    };
  };

  const daysLabel = getDaysOldLabel(business.days_old || 0);

  return (
    <div 
      className={`group bg-white rounded-xl shadow-sm border hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden ${
        business.featured 
          ? 'ring-2 ring-red-500 border-red-200 shadow-red-100' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="p-6">
        {/* Featured Badge */}
        {business.featured && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              <Star className="h-4 w-4 fill-current" />
              FEATURED
            </div>
          </div>
        )}
        
        {/* Business Name & Status */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-2 break-words leading-tight">
            {business.business_name}
          </h3>
          <span className={`inline-block text-xs px-3 py-1 rounded-full font-bold ${daysLabel.color} ${
            daysLabel.pulse ? 'animate-pulse' : ''
          }`}>
            {daysLabel.label}
          </span>
        </div>

        {/* Business Details with Icons */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-700 text-sm font-medium">
            <Building2 className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-xs font-semibold">
              {business.business_type}
            </span>
          </div>
          
          <div className="flex items-start text-gray-600 text-sm">
            <MapPin className="h-5 w-5 mr-3 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="break-words">{business.address}</span>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
            <span>Licensed: {formatDate(business.first_iss_dt)}</span>
          </div>
        </div>

        {/* Action Bar - Enhanced for Mobile */}
        <div className="pt-4 border-t border-gray-100">
          {/* Mobile Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col sm:flex-row gap-2">
              {business.phone && (
                <a 
                  href={`tel:${business.phone}`} 
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </a>
              )}
              {business.website && (
                <a 
                  href={business.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                  Website
                </a>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full whitespace-nowrap">
                {business.community}
              </span>
            </div>
          </div>
          
          {/* Swipeable Card Indicator for Mobile */}
          <div className="mt-3 flex justify-center lg:hidden">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Improved Filter Sidebar with better UX
interface FilterState {
  search: string;
  community: string;
  businessType: string;
  dateRange: string;
}

interface ImprovedFilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  businessCount: number;
}

export const ImprovedFilterSidebar: React.FC<ImprovedFilterSidebarProps> = ({ filters, setFilters, businessCount }) => {
  const communities = ['All Communities', 'Beltline', 'Hillhurst', 'Kensington', 'Mission', 'Eau Claire'];
  const businessTypes = ['All Types', 'Restaurant', 'Retail', 'Professional Services', 'Health & Wellness'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Filter Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-900">Find Businesses</h3>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Community Filter */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            📍 Neighborhood
          </label>
          <select
            value={filters.community}
            onChange={(e) => setFilters(prev => ({ ...prev, community: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium"
          >
            {communities.map(community => (
              <option key={community} value={community}>{community}</option>
            ))}
          </select>
        </div>

        {/* Business Type Filter */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            🏢 Business Type
          </label>
          <select
            value={filters.businessType}
            onChange={(e) => setFilters(prev => ({ ...prev, businessType: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium"
          >
            {businessTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            ⏰ Opened Within
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: '7', label: '1 Week', color: 'bg-green-100 text-green-800' },
              { value: '14', label: '2 Weeks', color: 'bg-blue-100 text-blue-800' },
              { value: '30', label: '1 Month', color: 'bg-purple-100 text-purple-800' },
              { value: '90', label: '3 Months', color: 'bg-gray-100 text-gray-800' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setFilters(prev => ({ ...prev, dateRange: option.value }))}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filters.dateRange === option.value
                    ? 'bg-red-500 text-white shadow-lg'
                    : `${option.color} hover:scale-105`
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border border-red-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">{businessCount}</div>
            <div className="text-sm text-red-700 font-medium">New Businesses Found</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Search Bar with Mobile Sticky Behavior
interface ImprovedSearchBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const ImprovedSearchBar: React.FC<ImprovedSearchBarProps> = ({ filters, setFilters }) => (
  <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40 lg:relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 lg:h-6 lg:w-6" />
        <input
          type="text"
          placeholder="Search by business name, type, or neighborhood..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="w-full pl-12 pr-6 py-3 lg:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base lg:text-lg placeholder-gray-500"
        />
        {filters.search && (
          <button
            onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  </div>
);

// Mobile Filter Drawer Component
interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  businessCount: number;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({ 
  isOpen, 
  onClose, 
  filters, 
  setFilters, 
  businessCount 
}) => {
  const communities = ['All Communities', 'Beltline', 'Hillhurst', 'Kensington', 'Mission', 'Eau Claire'];
  const businessTypes = ['All Types', 'Restaurant', 'Retail', 'Professional Services', 'Health & Wellness'];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Community Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                📍 Neighborhood
              </label>
              <select
                value={filters.community}
                onChange={(e) => setFilters(prev => ({ ...prev, community: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium"
              >
                {communities.map(community => (
                  <option key={community} value={community}>{community}</option>
                ))}
              </select>
            </div>

            {/* Business Type Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                🏢 Business Type
              </label>
              <select
                value={filters.businessType}
                onChange={(e) => setFilters(prev => ({ ...prev, businessType: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium"
              >
                {businessTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                ⏰ Opened Within
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: '7', label: '1 Week', color: 'bg-green-100 text-green-800' },
                  { value: '14', label: '2 Weeks', color: 'bg-blue-100 text-blue-800' },
                  { value: '30', label: '1 Month', color: 'bg-purple-100 text-purple-800' },
                  { value: '90', label: '3 Months', color: 'bg-gray-100 text-gray-800' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFilters(prev => ({ ...prev, dateRange: option.value }))}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      filters.dateRange === option.value
                        ? 'bg-red-500 text-white shadow-lg'
                        : `${option.color} hover:scale-105`
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border border-red-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">{businessCount}</div>
                <div className="text-sm text-red-700 font-medium">New Businesses Found</div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
