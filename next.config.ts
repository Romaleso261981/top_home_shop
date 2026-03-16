import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Статичний експорт для деплою на Apache
  output: "export",
};

export default nextConfig;
