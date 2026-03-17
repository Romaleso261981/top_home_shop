import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Статичний експорт для деплою на Apache
  output: "export",
  images: {
    // next/image оптимізація потребує Image Optimization API, якого немає в output: "export"
    unoptimized: true,
  },
};

export default nextConfig;
