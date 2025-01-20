export function validateEnv() {
  const requiredEnvVars = [
    'MONGODB_URI',
    'NODE_ENV',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET'
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }

  // Environment bilgilerini logla
  console.log('Environment validation:', {
    NODE_ENV: process.env.NODE_ENV,
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    HAS_MONGODB: !!process.env.MONGODB_URI,
    HAS_NEXTAUTH_URL: !!process.env.NEXTAUTH_URL
  });
} 