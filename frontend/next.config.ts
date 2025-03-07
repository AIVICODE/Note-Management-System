/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL,  // 🟢 Exportar API_URL al frontend
  },
};

module.exports = nextConfig;
