import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@fluentui/react-components'],
  experimental: {
    optimizePackageImports: ['@fluentui/react-components'],
  },
  turbopack: {},
};

export default nextConfig;
