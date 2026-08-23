import mongoose from 'mongoose';
import { ENV } from './env';
import { logger } from '../utils/logger';

let isConnected = false;

export const connectDatabase = async (): Promise<void> => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  if (!ENV.MONGODB_URI) {
    logger.warn('⚠️ MONGODB_URI is not defined in environment variables. Database features will be offline.');
    return;
  }

  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true, // Auto build indexes in development
    });

    isConnected = true;
    logger.info(`✅ MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    isConnected = false;
    logger.error('❌ MongoDB Connection Error:', error instanceof Error ? error.message : 'Unknown database error');
    if (ENV.NODE_ENV === 'production') {
      logger.error('Production database connection failed. Exiting process.');
      process.exit(1);
    }
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    logger.info('MongoDB disconnected gracefully.');
  }
};

export const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};
