import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    locales: ['en', 'tr', 'es', 'de'],
    defaultLocale: 'en',
  },
  appDir: true,
};

export default nextConfig;
