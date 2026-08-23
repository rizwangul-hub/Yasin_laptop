import { Router } from 'express';
import healthRoutes from './healthRoutes';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import brandRoutes from './brandRoutes';
import categoryRoutes from './categoryRoutes';
import useCaseRoutes from './useCaseRoutes';
import accessoryRoutes from './accessoryRoutes';
import settingsRoutes from './settingsRoutes';
import heroRoutes from './heroRoutes';
import inquiryRoutes from './inquiryRoutes';
import seoRoutes from './seoRoutes';
import uploadRoutes from './uploadRoutes';
import dashboardRoutes from './dashboardRoutes';
import activityRoutes from './activityRoutes';
import mediaRoutes from './mediaRoutes';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/brands', brandRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/use-cases', useCaseRoutes);
apiRouter.use('/accessories', accessoryRoutes);
apiRouter.use('/settings', settingsRoutes);
apiRouter.use('/hero', heroRoutes);
apiRouter.use('/inquiries', inquiryRoutes);
apiRouter.use('/seo', seoRoutes);
apiRouter.use('/upload', uploadRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/activity', activityRoutes);
apiRouter.use('/media', mediaRoutes);

export default apiRouter;
