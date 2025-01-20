import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com']
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true
  },
};
 
export default withNextIntl(nextConfig);