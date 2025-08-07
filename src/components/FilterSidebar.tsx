
import { Filter, Calendar, Building2, MapPin } from 'lucide-react';
import { Business, FilterState } from '../types/Business';

interface FilterSidebarProps {
  businesses: Business[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  businesses,
  filters,
  onFilterChange
}) => {
  // Get unique communities and business types
  const communities = Array.from(new Set(businesses.map(b => b.community))).sort();
  const businessTypes = Array.from(new Set(businesses.map(b => b.business_type))).sort();

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      community: '',
      businessType: '',
      dateRange: '90'
    });
  };

  const hasActiveFilters = filters.community || filters.businessType || filters.dateRange !== '90';

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-base font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-red-600 hover:text-red-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Date Range Filter */}
      <div className="mb-4">
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4" />
          <span>Licensed Within</span>
        </label>
        <div className="space-y-1">
          {[
            { value: '7', label: 'Last 7 days' },
            { value: '30', label: 'Last 30 days' },
            { value: '60', label: 'Last 60 days' },
            { value: '90', label: 'Last 90 days' }
          ].map(option => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="dateRange"
                value={option.value}
                checked={filters.dateRange === option.value}
                onChange={(e) => updateFilter('dateRange', e.target.value)}
                className="text-red-600 focus:ring-red-500 w-3 h-3"
              />
              <span className="text-xs text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Community Filter */}
      <div className="mb-4">
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4" />
          <span>Community</span>
        </label>
        <select
          value={filters.community}
          onChange={(e) => updateFilter('community', e.target.value)}
          className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-xs"
        >
          <option value="">All communities</option>
          {communities.map(community => (
            <option key={community} value={community}>
              {community}
            </option>
          ))}
        </select>
      </div>

      {/* Business Type Filter */}
      <div className="mb-4">
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
          <Building2 className="w-4 h-4" />
          <span>Business Type</span>
        </label>
        <select
          value={filters.businessType}
          onChange={(e) => updateFilter('businessType', e.target.value)}
          className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-xs"
        >
          <option value="">All business types</option>
          {businessTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-50 rounded-md p-3">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Quick Stats</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Total businesses</span>
            <span className="font-medium text-gray-900">{businesses.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">This week</span>
            <span className="font-medium text-green-600">
              {businesses.filter(b => b.days_old <= 7).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">This month</span>
            <span className="font-medium text-blue-600">
              {businesses.filter(b => b.days_old <= 30).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};