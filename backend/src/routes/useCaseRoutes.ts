import { Router } from 'express';
import {
  getUseCases,
  createUseCase,
  updateUseCase,
  deleteUseCase,
} from '../controllers/useCaseController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getUseCases);
router.post('/', authenticate, authorize(['admin']), createUseCase);
router.put('/:id', authenticate, authorize(['admin']), updateUseCase);
router.delete('/:id', authenticate, authorize(['admin']), deleteUseCase);

export default router;
