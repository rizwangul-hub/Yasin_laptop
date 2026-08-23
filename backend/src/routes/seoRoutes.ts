import { Router } from 'express';
import { getSEOByPage } from '../controllers/seoController';

const router = Router();

router.get('/:page', getSEOByPage);

export default router;
