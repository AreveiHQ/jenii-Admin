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
      ],
    } , webpack(config) {
        config.module.rules.push({
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        });
        return config;
      }};

export default nextConfig;
