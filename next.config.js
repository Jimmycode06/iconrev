/** @type {import('next').NextConfig} */
const nextConfig = {
  // Évite les erreurs PackFileCacheStrategy / chunks 404 quand le projet est
  // sous ~/Downloads ou un volume avec snapshot FS capricieux (webpack cache disque).
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
