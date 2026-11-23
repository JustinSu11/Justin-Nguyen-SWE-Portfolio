/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // relative asset URLs so the static export works from any path
  assetPrefix: process.env.ASSET_PREFIX ?? undefined,
};
export default nextConfig;
