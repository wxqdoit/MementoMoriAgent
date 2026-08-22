import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;
const repoName = 'MementoMoriAgent';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isGithubActions ? `/${repoName}` : '',
  assetPrefix: isGithubActions ? `/${repoName}/` : '',
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['pino-pretty', 'lokijs', 'encoding', '@reown/appkit', '@reown/appkit-adapter-wagmi'],
  turbopack: {},
};

export default nextConfig;
