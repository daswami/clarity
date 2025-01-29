// next.config.ts

import { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during production builds
  },
};

export default nextConfig;
