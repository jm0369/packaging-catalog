/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'pub-*.r2.dev' }, // Cloudflare R2 public domain
      // if you also use a custom CDN:
      // { protocol: 'https', hostname: 'cdn.example.com' },
    ],
  },
    output: 'standalone',
};

module.exports = nextConfig;