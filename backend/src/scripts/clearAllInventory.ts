import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { Accessory } from '../models/Accessory';
import { logger } from '../utils/logger';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://rizwangul535_db_user:LYGTNebZbKQQ0csd@cluster0.wun93hu.mongodb.net/yaseen_malak_db';

async function clearInventory(): Promise<void> {
  logger.info('Connecting to MongoDB Atlas to clear all products and accessories...');

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    logger.info('Connected to database successfully.');

    // 1. Delete all products
    const prodRes = await Product.deleteMany({});
    logger.info(`Deleted all laptop & chromebook products: ${prodRes.deletedCount} items removed.`);

    // 2. Delete all accessories
    const accRes = await Accessory.deleteMany({});
    logger.info(`Deleted all accessories: ${accRes.deletedCount} items removed.`);

    logger.info('Catalog is now 100% clean and ready for fresh inventory entries.');
  } catch (error) {
    logger.error('Error clearing inventory:', error);
  } finally {
    await mongoose.disconnect();
    logger.info('Database connection closed.');
    process.exit(0);
  }
}

clearInventory();
