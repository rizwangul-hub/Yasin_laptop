import { CorsOptions } from 'cors';
import { ENV } from './env';

const allowedOrigins: string[] = [
  'https://yasin-laptop-hub.vercel.app',
  'https://yasin-laptop-admin.vercel.app',
  'https://yasin-laptop-backend.vercel.app',
  ENV.FRONTEND_URL,
  ENV.ADMIN_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
].filter(Boolean);

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile, curl, Postman, SSR server-to-server)
    if (!origin) {
      callback(null, true);
      return;
    }

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      ENV.NODE_ENV !== 'production'
    ) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
