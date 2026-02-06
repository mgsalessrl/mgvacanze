import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
      ],
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'mgvacanze.com',
      }
    ],
  },
  async rewrites() {
    return [
      // Flotta (Weekly) – point to static pages with BoatDetailLayout
      {
        source: '/noleggio-catamarano/elyvian-spirit',
        destination: '/noleggio/elyvian-spirit',
      },
      {
        source: '/noleggio-catamarano/elyvian-dream',
        destination: '/noleggio/elyvian-dream',
      },
      {
        source: '/noleggio-yacht/elyvian-breeze',
        destination: '/noleggio/elyvian-breeze',
      },

      // Pasqua Italia – point to renamed static pages
      {
        source: '/pasqua-elyvian-dream',
        destination: '/noleggio/pasqua-elyvian-dream',
      },
      {
        source: '/pasqua-elyvian-spirit',
        destination: '/noleggio/pasqua-elyvian-spirit',
      },
      {
        source: '/pasqua-elyvian-breeze',
        destination: '/noleggio/pasqua-elyvian-breeze',
      },

      // Pasqua Grecia – point to renamed static pages
      {
        source: '/pasqua-grecia-elyvian-dream',
        destination: '/noleggio/pasqua-grecia-elyvian-dream',
      },
      {
        source: '/pasqua-grecia-elyvian-spirit',
        destination: '/noleggio/pasqua-grecia-elyvian-spirit',
      },
      {
        source: '/pasqua-grecia-elyvian-breeze',
        destination: '/noleggio/pasqua-grecia-elyvian-breeze',
      },
    ]
  },
  async redirects() {
    return [
      // Fleet: redirect old /boat/* URLs to SEO canonical URLs
      { source: '/boat/elyvian-spirit', destination: '/noleggio-catamarano/elyvian-spirit', permanent: true },
      { source: '/boat/elyvian-dream', destination: '/noleggio-catamarano/elyvian-dream', permanent: true },
      { source: '/boat/elyvian-breeze', destination: '/noleggio-yacht/elyvian-breeze', permanent: true },
      // Easter: redirect old directory-based URLs to new SEO URLs
      { source: '/noleggio/pasqua-dream', destination: '/pasqua-elyvian-dream', permanent: true },
      { source: '/noleggio/pasqua-dream-grecia', destination: '/pasqua-grecia-elyvian-dream', permanent: true },
      { source: '/noleggio/pasqua-spirit', destination: '/pasqua-grecia-elyvian-spirit', permanent: true },
      { source: '/noleggio/pasqua-spirit-italia', destination: '/pasqua-elyvian-spirit', permanent: true },
      { source: '/noleggio/pasqua-breeze-grecia', destination: '/pasqua-grecia-elyvian-breeze', permanent: true },
      { source: '/noleggio/pasqua-in-mare-elyvian-breeze', destination: '/pasqua-elyvian-breeze', permanent: true },
    ]
  }
};

export default nextConfig;
