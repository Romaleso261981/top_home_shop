import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  // Для хостингу (Apache) збираємо статику, а локально залишаємо серверні можливості (API routes).
  ...(isStaticExport ? { output: "export" } : {}),
  images: {
    // next/image оптимізація потребує Image Optimization API, якого немає в output: "export"
    unoptimized: true,
  },
};

export default nextConfig;
