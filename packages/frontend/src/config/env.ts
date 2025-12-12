// Frontend environment configuration
// Vite exposes env vars prefixed with VITE_ at build time

export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
