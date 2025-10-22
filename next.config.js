/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add this to temporarily disable linting/type checks on build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
