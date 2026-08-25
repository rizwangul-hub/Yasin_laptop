import { Router } from 'express';
import { getDashboardStats, clearInventory } from '../controllers/dashboardController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/stats', authenticate, authorize(['admin']), getDashboardStats);
router.post('/clear-inventory', authenticate, authorize(['admin']), clearInventory);
router.delete('/clear-inventory', authenticate, authorize(['admin']), clearInventory);

export default router;
