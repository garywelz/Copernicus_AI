/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['i.scdn.co', 'mosaic.scdn.co', 'platform-lookaside.fbsbx.com', 'images-ak.spotifycdn.com'],
  },
};

export default nextConfig;
