import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  swcMinify: true,
  compress: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
