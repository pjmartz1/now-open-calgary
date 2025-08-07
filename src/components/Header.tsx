
import { Search, MapPin } from 'lucide-react';

interface HeaderProps {
  onSearch: (term: string) => void;
  searchTerm: string;
  currentPage: 'businesses' | 'for-owners' | 'about' | 'privacy' | 'terms' | 'diagnostics';
  onNavigate: (page: 'businesses' | 'for-owners' | 'about' | 'privacy' | 'terms' | 'diagnostics') => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, searchTerm, currentPage, onNavigate }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-sm">
              <div className="relative">
                <MapPin className="w-5 h-5 text-white" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Now Open Calgary</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Discover new local businesses</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => onNavigate('businesses')}
              className={`font-medium transition-colors ${
                currentPage === 'businesses' 
                  ? 'text-red-600' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              Businesses
            </button>
            <button 
              onClick={() => onNavigate('for-owners')}
              className={`font-medium transition-colors ${
                currentPage === 'for-owners' 
                  ? 'text-red-600' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              For Business Owners
            </button>
            <button 
              onClick={() => onNavigate('about')}
              className={`font-medium transition-colors ${
                currentPage === 'about' 
                  ? 'text-red-600' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              About
            </button>

            <button 
              onClick={() => onNavigate('for-owners')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Feature Your Business
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-red-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {currentPage === 'businesses' && (
          <div className="pb-6">
            <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 text-sm"
              placeholder="Search businesses, communities, or business types..."
            />
            </div>
          </div>
        )}
      </div>

    </header>
  );
};