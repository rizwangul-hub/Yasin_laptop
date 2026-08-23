import { Router } from 'express';
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  archiveInquiry,
} from '../controllers/inquiryController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public: Customers submit WhatsApp/Contact lead
router.post('/', createInquiry);

// Admin: Manage leads
router.get('/', authenticate, authorize(['admin']), getInquiries);
router.patch('/:id', authenticate, authorize(['admin']), updateInquiryStatus);
router.delete('/:id', authenticate, authorize(['admin']), archiveInquiry);

export default router;
