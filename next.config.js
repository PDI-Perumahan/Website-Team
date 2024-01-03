/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jedqepcstttqpnfnxgyq.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
