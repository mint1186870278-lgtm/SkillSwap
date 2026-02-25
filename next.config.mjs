/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ['images.unsplash.com', 'picsum.photos', 'cdn.tailwindcss.com'], // Add domains used in project
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // Easing migration
  },
  eslint: {
    ignoreDuringBuilds: true, // Easing migration
  },
};

export default nextConfig;