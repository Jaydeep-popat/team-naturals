/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // 👈 ADD THIS - Critical for Node.js hosting
  experimental: {
    cpus: 1,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig