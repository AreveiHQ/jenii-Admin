/** @type {import('next').NextConfig} */
const nextConfig = {eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "res.cloudinary.com",
        },
        {
          protocol: "https",
          hostname: "ui-avatars.com",
        },
        {
          protocol: "https",
          hostname: "cdn.bio.link",
        },
      ],
    } };

export default nextConfig;
