import { Router } from 'express';
import { uploadImage, deleteImage } from '../controllers/uploadController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticate, authorize('admin', 'superadmin'), uploadImage);
router.post('/delete', authenticate, authorize('admin', 'superadmin'), deleteImage);

export default router;
