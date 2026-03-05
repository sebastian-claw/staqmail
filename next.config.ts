import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Tauri — no Node.js server required
  output: "export",
  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },
  // Tauri uses file:// protocol in production; ensure assets resolve correctly
  trailingSlash: true,
};

export default nextConfig;
