import dotenv from 'dotenv';
dotenv.config();

import { connectDatabase, disconnectDatabase } from '../config/database';
import { User } from '../models/User';
import { hashPassword } from '../utils/auth';
import { logger } from '../utils/logger';

const seedInitialAdmin = async (): Promise<void> => {
  const adminName = process.env.ADMIN_NAME || 'Yasin Wahab';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@yasinlaptophub.com';
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    logger.warn('⚠️ ADMIN_PASSWORD not specified in environment variables. Admin seed skipped.');
    return;
  }

  try {
    await connectDatabase();

    const existingUser = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existingUser) {
      logger.info(`Admin user [${adminEmail}] already exists. Skipping.`);
    } else {
      const passwordHash = await hashPassword(adminPassword);
      await User.create({
        name: adminName,
        email: adminEmail.toLowerCase(),
        passwordHash,
        role: 'superadmin',
        isActive: true,
      });
      logger.info(`✅ Initial admin account [${adminEmail}] created successfully.`);
    }
  } catch (error) {
    logger.error('Admin seeding error:', error);
  } finally {
    await disconnectDatabase();
    process.exit(0);
  }
};

seedInitialAdmin();
