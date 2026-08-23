import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors';
import apiRouter from './routes';
import { notFoundHandler } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import { connectDatabase } from './config/database';

export const createApp = (): Application => {
  const app: Application = express();

  // Security & Body parsing with reasonable limits
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Auto connect database on requests in serverless environments
  app.use(async (_req: Request, _res: Response, next: NextFunction) => {
    try {
      await connectDatabase();
    } catch {
      // Allow request to proceed to error/fallback handling
    }
    next();
  });

  // Root endpoint info
  app.get('/', (_req, res) => {
    res.json({
      name: 'Yasin Laptop Hub API',
      version: '1.0.0',
      owner: 'Yasin Wahab',
      status: 'operational',
      namespaces: [
        '/api/health',
        '/api/auth',
        '/api/products',
        '/api/brands',
        '/api/categories',
        '/api/use-cases',
        '/api/accessories',
        '/api/settings',
        '/api/hero',
        '/api/inquiries',
        '/api/seo',
      ],
    });
  });

  // Main API Router
  app.use('/api', apiRouter);

  // 404 & Central Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

const app = createApp();

export default app;
