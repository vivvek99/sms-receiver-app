import { Router } from 'express';
import { getAllPhones, getPhoneById, createPhone, deletePhone } from '../controllers/phoneController';
import { getMessagesByPhoneId } from '../controllers/messageController';

const router = Router();

// Phone number routes
router.get('/', getAllPhones);
router.get('/:id', getPhoneById);
router.post('/', createPhone);
router.delete('/:id', deletePhone);

// Messages for a specific phone
router.get('/:phoneId/messages', getMessagesByPhoneId);

export default router;
