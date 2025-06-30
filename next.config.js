/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true,
  },
  images: {
    domains: ['localhost', 'greenmindshift.com'],
    formats: ['image/webp', 'image/avif'],
  },
  async rewrites() {
    return [
      // SEO-freundliche URLs für Artikel
      {
        source: '/blog/:slug',
        destination: '/blog/[slug]',
      },
      // Kategorien
      {
        source: '/kategorie/:slug',
        destination: '/category/[slug]',
      },
      // Tags
      {
        source: '/tag/:slug',
        destination: '/tag/[slug]',
      },
    ];
  },
  async redirects() {
    return [
      // www zu non-www redirect
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.greenmindshift.com',
          },
        ],
        destination: 'https://greenmindshift.com/:path*',
        permanent: true,
      },
    ];
  },
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
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  output: 'standalone',
};

module.exports = nextConfig; 