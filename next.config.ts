import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable all worker threads and parallel processing for Windows compatibility
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  // Move server external packages to correct location
  serverExternalPackages: [],
  // Force single-threaded compilation
  webpack: (config, { dev, isServer, webpack }) => {
    // Disable worker threads entirely
    config.parallelism = 1;
    
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
