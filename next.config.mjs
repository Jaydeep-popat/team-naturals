import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: /^\/_next\/static\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'static-assets',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|webp|gif|ico)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /\/api\/(?:products|categories).*/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'catalog-api',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60,
          },
        },
      },
      {
        urlPattern: /\/api\/(?:cart|auth|checkout|orders|admin).*/i,
        handler: 'NetworkOnly',
      },
      {
        urlPattern: /^https:\/\/api\.teamnaturals\.in\/api\/.*/i,
        handler: 'NetworkOnly',
      },
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'html-pages',
          networkTimeoutSeconds: 3,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60,
          },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['maplibre-gl'],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    cpus: 1,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    const configuredApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const isLocalApiUrl = configuredApiUrl && /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/i.test(configuredApiUrl);
    const apiUrl = process.env.NODE_ENV === 'production' && (!configuredApiUrl || isLocalApiUrl)
      ? 'https://api.teamnaturals.in'
      : (configuredApiUrl || 'http://127.0.0.1:8000');

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default withPWA(nextConfig);
