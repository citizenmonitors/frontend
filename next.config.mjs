import withPWAConfigurer from "next-pwa";

const withPWA = withPWAConfigurer({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  swcMinify: true, // Enable SWC minification for improved performance
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagsapi.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'navalny.onrender.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**'
      },
    ],
  }
});

export default nextConfig;
