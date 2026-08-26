import { Router } from 'express';
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getReviews);
router.post('/', createReview);
router.put('/:id', authenticate, authorize('admin', 'superadmin'), updateReview);
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), deleteReview);

export default router;
