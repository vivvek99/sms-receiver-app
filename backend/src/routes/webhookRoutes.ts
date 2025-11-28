import { Router } from 'express';
import { handleTwilioWebhook } from '../controllers/webhookController';
import { validateTwilioWebhook } from '../middleware';

const router = Router();

// Twilio webhook for incoming SMS
router.post('/twilio', validateTwilioWebhook, handleTwilioWebhook);

export default router;
