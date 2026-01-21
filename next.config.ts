import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/server/:path*',
        destination: `${process.env.HOST_SERVER || 'http://localhost:8080'}/:path*`,
      },
    ]
  },
};

export default nextConfig;
