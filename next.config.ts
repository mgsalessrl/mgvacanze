import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
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
      // Flotta (Weekly)
      {
        source: '/noleggio-catamarano/elyvian-spirit',
        destination: '/boat/elyvian-spirit',
      },
      {
        source: '/noleggio-catamarano/elyvian-dream',
        destination: '/boat/elyvian-dream',
      },
      {
        source: '/noleggio-yacht/elyvian-breeze',
        destination: '/boat/elyvian-breeze',
      },

      // Pasqua Italia
      {
        source: '/pasqua-elyvian-dream',
        destination: '/boat/pasqua-dream',
      },
      {
        source: '/pasqua-elyvian-spirit',
        destination: '/boat/pasqua-spirit',
      },
      {
        source: '/pasqua-elyvian-breeze',
        destination: '/boat/pasqua-breeze',
      },

      // Pasqua Grecia (Pass Variant for Metadata)
      {
        source: '/pasqua-grecia-elyvian-dream',
        destination: '/boat/pasqua-dream?variant=grecia',
      },
      {
        source: '/pasqua-grecia-elyvian-spirit',
        destination: '/boat/pasqua-spirit?variant=grecia',
      },
      {
        source: '/pasqua-grecia-elyvian-breeze',
        destination: '/boat/pasqua-breeze?variant=grecia',
      },
    ]
  }
};

export default nextConfig;
