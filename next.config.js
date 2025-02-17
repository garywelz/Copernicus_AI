/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  }
}

module.exports = nextConfig 