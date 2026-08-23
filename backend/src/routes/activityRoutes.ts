import { Router } from 'express';
import { getActivityLogs } from '../controllers/activityController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, authorize(['admin']), getActivityLogs);

export default router;
