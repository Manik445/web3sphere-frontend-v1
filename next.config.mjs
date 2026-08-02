/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: [
    '@reown/appkit',
    '@reown/appkit-adapter-wagmi',
    '@reown/appkit-adapter-solana',
  ],
}

export default nextConfig
