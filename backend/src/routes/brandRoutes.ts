import { Router } from 'express';
import {
  getBrands,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getBrands);
router.get('/:slug', getBrandBySlug);
router.post('/', authenticate, authorize(['admin']), createBrand);
router.put('/:id', authenticate, authorize(['admin']), updateBrand);
router.delete('/:id', authenticate, authorize(['admin']), deleteBrand);

export default router;
