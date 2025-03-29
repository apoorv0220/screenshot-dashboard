/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com/gsi/; style-src 'self' 'unsafe-inline'; img-src 'self' data: res.cloudinary.com; font-src 'self';",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;