import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pino-pretty', 'lokijs', 'encoding', '@reown/appkit', '@reown/appkit-adapter-wagmi'],
  turbopack: {},
};

export default nextConfig;
