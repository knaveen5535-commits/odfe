/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: { domains: ['localhost'] },
  experimental: {
    webpackBuildWorker: false,
  },
};

module.exports = nextConfig;
