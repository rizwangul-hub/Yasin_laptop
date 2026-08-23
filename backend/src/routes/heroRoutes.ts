import { Router } from 'express';
import {
  getHeroMedia,
  createHeroMedia,
  updateHeroMedia,
  deleteHeroMedia,
} from '../controllers/heroController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getHeroMedia);
router.post('/', authenticate, authorize(['admin']), createHeroMedia);
router.put('/:id', authenticate, authorize(['admin']), updateHeroMedia);
router.delete('/:id', authenticate, authorize(['admin']), deleteHeroMedia);

export default router;
