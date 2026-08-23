import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/stats', authenticate, authorize(['admin']), getDashboardStats);

export default router;
