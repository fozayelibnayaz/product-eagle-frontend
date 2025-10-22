/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other config, usually an empty object for default setup
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig