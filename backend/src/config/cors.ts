import { CorsOptions } from 'cors';
import { ENV } from './env';

const allowedOrigins: string[] = [
  'https://yasinlaptop.store',
  'https://www.yasinlaptop.store',
  'https://yasin-laptop-hub.vercel.app',
  'https://yasin-laptop-admin.vercel.app',
  'https://yasin-laptop-backend.vercel.app',
  ENV.FRONTEND_URL,
  ENV.ADMIN_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
].filter(Boolean);

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, SSR server-to-server)
    if (!origin) {
      callback(null, true);
      return;
    }

    const isAllowed =
      allowedOrigins.includes(origin) ||
      origin.endsWith('.yasinlaptop.store') ||
      origin.endsWith('yasinlaptop.store') ||
      origin.endsWith('.vercel.app') ||
      ENV.NODE_ENV !== 'production';

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS Notice] Allowing origin: ${origin}`);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
