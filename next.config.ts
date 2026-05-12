import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  turbopack: {
    // 워크스페이스 루트를 현재 프로젝트로 고정
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.notion.so",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
    ],
  },
}

export default nextConfig
