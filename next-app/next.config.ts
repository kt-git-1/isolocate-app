import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is disabled via env in package.json scripts (TURBOPACK=0).
  
  // Next.js 16では、serverExternalPackagesを使用してサーバー専用パッケージを指定
  // 動的インポートを使用しているため、この設定は補助的な役割を果たします
  serverExternalPackages: ['pg'],
};

export default nextConfig;
