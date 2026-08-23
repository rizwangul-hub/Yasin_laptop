import { Router } from 'express';
import {
  getAccessories,
  createAccessory,
  updateAccessory,
  deleteAccessory,
} from '../controllers/accessoryController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getAccessories);
router.post('/', authenticate, authorize(['admin']), createAccessory);
router.put('/:id', authenticate, authorize(['admin']), updateAccessory);
router.delete('/:id', authenticate, authorize(['admin']), deleteAccessory);

export default router;
