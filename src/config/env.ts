export function getEnv() {
  return {
    PORT: process.env.PORT || '5000',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || '',
    NODE_ENV: process.env.NODE_ENV || 'development',
    // GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS || '',
    KEYFILE: process.env.KEYFILE || ''
  };
}
