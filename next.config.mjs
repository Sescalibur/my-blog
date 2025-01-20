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

// Sadece log alalım
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode');
} else {
  console.log('Running in development mode:', process.env.NODE_ENV);
}

export default withNextIntl(nextConfig);