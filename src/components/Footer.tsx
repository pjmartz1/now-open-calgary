import React from 'react';
import { MapPin, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Now Open Calgary</h3>
                <p className="text-sm text-gray-400">Discover new local businesses</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted source for discovering Calgary's newest restaurants, shops, and services. 
              Updated daily from official City of Calgary data.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#businesses" className="text-gray-300 hover:text-white transition-colors">
                  Browse Businesses
                </a>
              </li>
              <li>
                <a href="#for-owners" className="text-gray-300 hover:text-white transition-colors">
                  For Business Owners
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Calgary Communities */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Popular Communities</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="?community=Beltline" className="text-gray-300 hover:text-white transition-colors">
                  Beltline
                </a>
              </li>
              <li>
                <a href="?community=Inglewood" className="text-gray-300 hover:text-white transition-colors">
                  Inglewood
                </a>
              </li>
              <li>
                <a href="?community=Kensington-Chinatown" className="text-gray-300 hover:text-white transition-colors">
                  Kensington
                </a>
              </li>
              <li>
                <a href="?community=Mission" className="text-gray-300 hover:text-white transition-colors">
                  Mission
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* SEO Footer Content */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <p className="text-gray-300 text-sm leading-relaxed">
              <strong>Now Open Calgary</strong> is a free, community-driven directory showcasing the latest restaurants, shops, and services opening across the city. 
              Sourced from the official <a href="https://data.calgary.ca" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">City of Calgary Business Licences dataset</a>, 
              our listings are updated daily to help you discover and support local businesses. Whether you live in Beltline, Inglewood, Kensington, Mission, Hillhurst, 
              Bridgeland, Eau Claire, Ramsay, or beyond, find out what's new near you today. Support Calgary\'s entrepreneurial spirit and discover your next favorite local spot.
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4 md:mb-0">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for Calgary's business community</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span>© 2024 Now Open Calgary</span>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'privacy' }))}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'terms' }))}
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </button>
            <a 
              href="https://github.com/pjmartz1/New-in-Calgary" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center space-x-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};