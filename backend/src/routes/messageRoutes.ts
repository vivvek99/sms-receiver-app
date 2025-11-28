import { Router } from 'express';
import { getMessageById } from '../controllers/messageController';

const router = Router();

router.get('/:id', getMessageById);

export default router;
