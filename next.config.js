/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  maxDuration: 120,
};

module.exports = nextConfig;