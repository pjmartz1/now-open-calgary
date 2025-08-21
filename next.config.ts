import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable all worker threads and parallel processing for Windows compatibility
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  // Move server external packages to correct location
  serverExternalPackages: [],
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['www.nowopencalgary.ca'],
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Headers for better performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  // Force single-threaded compilation
  webpack: (config, { dev, isServer, webpack }) => {
    // Disable worker threads entirely
    config.parallelism = 1;
    
    // Fix Windows ESM loader issues
    config.resolve = config.resolve || {};
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts'],
      '.jsx': ['.jsx', '.tsx'],
    };
    
    if (dev) {
      // Force synchronous compilation in development
      config.cache = false;
      config.optimization = {
        ...config.optimization,
        minimize: false,
        splitChunks: false,
        concatenateModules: false,
      }
    }
    
    return config
  },
  // Additional stability settings
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
