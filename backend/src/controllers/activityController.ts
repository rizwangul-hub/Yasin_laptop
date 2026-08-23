import { Request, Response } from 'express';
import { ActivityLog } from '../models/ActivityLog';
import { sendSuccess } from '../utils/apiResponse';
import { isDatabaseConnected } from '../config/database';

export const getActivityLogs = async (req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendSuccess(res, 'Database offline; returning placeholder activity', []);
    return;
  }

  const limit = Math.min(100, parseInt(String(req.query.limit || '50'), 10));
  const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(limit).lean();

  sendSuccess(res, 'Activity logs fetched successfully', logs);
};

export const logActivity = async (action: string, entityType: 'product' | 'category' | 'brand' | 'setting' | 'auth', details: string, entityId?: string, user = 'Yasin Admin') => {
  try {
    if (isDatabaseConnected()) {
      await ActivityLog.create({
        action,
        user,
        entityType,
        entityId,
        details,
      });
    }
  } catch (err) {
    // Ignore audit log error so primary operation is not blocked
  }
};
