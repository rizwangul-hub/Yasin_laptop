import dotenv from 'dotenv';
dotenv.config();

import readline from 'readline';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { Product } from '../models/Product';
import { Accessory } from '../models/Accessory';
import { logger } from '../utils/logger';

async function resetDemoData(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  logger.warn('⚠️ WARNING: This will delete seeded products and accessories matching demo SKUs (starting with YLH-).');

  rl.question('Are you sure you want to delete demo catalog items? (type "yes" to confirm): ', async (answer) => {
    rl.close();

    if (answer.trim().toLowerCase() !== 'yes') {
      logger.info('Reset operation cancelled by user.');
      process.exit(0);
    }

    try {
      await connectDatabase();

      const prodRes = await Product.deleteMany({ sku: { $regex: /^YLH-/ } });
      const accRes = await Accessory.deleteMany({ sku: { $regex: /^YLH-/ } });

      logger.info(`✅ Successfully removed ${prodRes.deletedCount} demo products and ${accRes.deletedCount} demo accessories.`);
    } catch (error) {
      logger.error('Error during demo reset:', error);
    } finally {
      await disconnectDatabase();
      process.exit(0);
    }
  });
}

resetDemoData();
