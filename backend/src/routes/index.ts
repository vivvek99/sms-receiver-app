import { Router } from 'express';
import phoneRoutes from './phoneRoutes';
import messageRoutes from './messageRoutes';
import webhookRoutes from './webhookRoutes';

const router = Router();

router.use('/phones', phoneRoutes);
router.use('/messages', messageRoutes);
router.use('/webhook', webhookRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
