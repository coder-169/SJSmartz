/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dk7lbaz1v/image/upload/**",
      },
      {
        protocol: "https",
        hostname: "alpha.sjinovations.com",
        port: "",
        pathname: "/_next/image",
      },
    ],
  },
  crossOrigin: "anonymous",
};

module.exports = nextConfig;
