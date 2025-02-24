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
      {
        protocol: "https",
        hostname: "www.redwolf.in",
      },
      {
        protocol: "https",
        hostname: "redwolf.in",
      },
    ],
  }
};

export default nextConfig;
