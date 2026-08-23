import { Router } from 'express';
import { loginAdmin, getMe, changePassword, logoutAdmin } from '../controllers/authController';
import { validateRequest } from '../middleware/validation';
import { loginSchema } from '../validators/schemas';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', validateRequest(loginSchema), loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', authenticate, getMe);
router.post('/change-password', authenticate, changePassword);

export default router;
