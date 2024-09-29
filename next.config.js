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
    ],
  },
};

module.exports = nextConfig;
