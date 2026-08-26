import mongoose from 'mongoose';
import { ENV } from './env';
import { logger } from '../utils/logger';

let cachedPromise: Promise<typeof mongoose> | null = null;

export const connectDatabase = async (): Promise<typeof mongoose | null> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (cachedPromise && mongoose.connection.readyState === 2) {
    return cachedPromise;
  }

  if (!ENV.MONGODB_URI) {
    logger.warn('⚠️ MONGODB_URI is not defined in environment variables. Database features will be offline.');
    return null;
  }

  cachedPromise = mongoose.connect(ENV.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 8000,
    socketTimeoutMS: 20000,
    maxPoolSize: 10,
    minPoolSize: 1,
    bufferCommands: false,
    autoIndex: true,
  });

  try {
    const conn = await cachedPromise;
    logger.info(`✅ MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    cachedPromise = null;
    logger.error('❌ MongoDB Connection Error:', error instanceof Error ? error.message : 'Unknown database error');
    return null;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    cachedPromise = null;
    logger.info('MongoDB disconnected gracefully.');
  }
};

export const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};
