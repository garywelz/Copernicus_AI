/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      }
    ],
    domains: ['img.youtube.com'],
    unoptimized: true,
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Exclude tools directory
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      exclude: /tools/,
    });
    return config;
  },
  output: 'export',
}

module.exports = nextConfig 