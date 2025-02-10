/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
    ],
  }
};

export default nextConfig;
