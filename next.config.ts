import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1,
  },
  async rewrites() {
    // In production, Next.js will use the LIVE backend URL if you provide one in your environment variables.
    // If not, it defaults to your local backend for local testing.
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
