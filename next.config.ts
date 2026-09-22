import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // AVIF first; WebP for browsers without it.
    formats: ["image/avif", "image/webp"],
    // 60 for large atmospheric frames, 75 default, 85 for material close-ups.
    qualities: [60, 75, 85],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
    imageSizes: [96, 160, 256, 384, 512],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    // Tree-shake three's barrel import in the lazily loaded model chunk.
    optimizePackageImports: ["three"],
  },
};

export default nextConfig;
