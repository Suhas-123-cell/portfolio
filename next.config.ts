import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: 'opengraph.githubassets.com' }],
  },
};

export default nextConfig;
