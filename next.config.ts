import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["mermaid"],
  webpack(config) {
    // Mermaid ships ESM-only sub-packages that trip up webpack chunking.
    // Bundling them into a single chunk avoids the "Loading chunk … failed" error.
    config.resolve = {
      ...config.resolve,
      extensionAlias: {
        ...config.resolve?.extensionAlias,
        ".js": [".ts", ".tsx", ".js", ".jsx"],
      },
    };
    return config;
  },
};

export default nextConfig;
