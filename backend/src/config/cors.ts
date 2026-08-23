import { CorsOptions } from 'cors';
import { ENV } from './env';

const allowedOrigins: string[] = [
  ENV.FRONTEND_URL,
  ENV.ADMIN_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
].filter(Boolean);

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server) in development
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (ENV.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
