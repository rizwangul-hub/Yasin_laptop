import { Router } from 'express';
import { getMediaLibrary, deleteMedia } from '../controllers/mediaController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, authorize(['admin']), getMediaLibrary);
router.post('/delete', authenticate, authorize(['admin']), deleteMedia);

export default router;
