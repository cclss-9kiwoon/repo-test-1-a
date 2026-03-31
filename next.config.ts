import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/repo-test-1-a/test-tale-one",
  assetPrefix: "/repo-test-1-a/test-tale-one",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
