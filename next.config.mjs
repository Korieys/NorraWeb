/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.DAYPACK_BUILD_DIR || ".next",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
};

export default nextConfig;
