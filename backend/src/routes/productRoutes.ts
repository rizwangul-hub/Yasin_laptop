import { Router } from 'express';
import {
  getProducts,
  getProductFilters,
  getProductBySlug,
  getProductById,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductField,
  duplicateProduct,
  bulkActionProducts,
} from '../controllers/productController';
import { validateRequest } from '../middleware/validation';
import { productQuerySchema } from '../validators/schemas';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', validateRequest(productQuerySchema), getProducts);
router.get('/filters', getProductFilters);
router.get('/related/:idOrSlug', getRelatedProducts);
router.get('/id/:id', getProductById);
router.get('/:slug', getProductBySlug);

// Admin protected routes
router.post('/', authenticate, authorize('admin'), createProduct);
router.post('/bulk-action', authenticate, authorize('admin'), bulkActionProducts);
router.post('/duplicate/:id', authenticate, authorize('admin'), duplicateProduct);
router.put('/:id', authenticate, authorize('admin'), updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);
router.patch('/:id/toggle', authenticate, authorize('admin'), toggleProductField);

export default router;
