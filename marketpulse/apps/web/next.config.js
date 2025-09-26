/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@marketpulse/shared'],
  output: 'standalone',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig