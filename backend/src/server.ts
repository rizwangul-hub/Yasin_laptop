import { createApp } from './app';
import { ENV } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { logger } from './utils/logger';

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    const app = createApp();
    const port = Number(ENV.PORT) || 5000;

    const server = app.listen(port, () => {
      logger.info(`🚀 Yasin Laptop Hub API listening on port ${port} [${ENV.NODE_ENV}]`);
      logger.info(`🔗 Health Check: http://localhost:${port}/api/health`);
    });

    // Graceful Shutdown handling
    const shutdown = async (signal: string) => {
      logger.info(`\n🛑 Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        await disconnectDatabase();
        process.exit(0);
      });

      // Force shutdown after 10s if hung
      setTimeout(() => {
        logger.error('Forceful shutdown after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    logger.error('Fatal Server Startup Error:', error);
    process.exit(1);
  }
};

startServer();
