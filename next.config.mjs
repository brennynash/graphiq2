/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "app.amazingimages.ai",
      },
      {
        protocol: "https",
        hostname: "graphic-art-pi.vercel.app",
      }
    ],
  },
};

export default nextConfig;
