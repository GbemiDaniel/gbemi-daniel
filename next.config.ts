import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Dev.to serves cover images from a rotating set of media subdomains
        // (media0.dev.to, media2.dev.to, ...), so this covers all of them.
        hostname: "**.dev.to",
      },
      {
        protocol: "https",
        // LinkedIn post images come from either media.licdn.com or
        // static.licdn.com depending on the asset.
        hostname: "**.licdn.com",
      },
    ],
  },
};

export default nextConfig;
