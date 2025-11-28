import { Request, Response, NextFunction } from 'express';
import { phoneService, messageService } from '../services';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export function setSocketIO(socketIO: SocketIOServer): void {
  io = socketIO;
}

export async function handleTwilioWebhook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      From: from,
      To: to,
      Body: body,
      MessageSid: twilioSid,
    } = req.body;

    console.log(`[Webhook] Received SMS from ${from} to ${to}`);

    // Find the phone number in our database
    const phone = await phoneService.getPhoneByNumber(to);

    if (!phone) {
      console.warn(`[Webhook] Phone number not found: ${to}`);
      // Still respond with TwiML to acknowledge receipt
      res.type('text/xml').send('<Response></Response>');
      return;
    }

    // Store the message
    const message = await messageService.createMessage({
      from,
      to,
      body,
      twilioSid,
      phoneNumberId: phone.id,
    });

    console.log(`[Webhook] Message stored with ID: ${message.id}`);

    // Emit to connected WebSocket clients
    if (io) {
      io.to(`phone:${phone.id}`).emit('new_message', message);
      io.emit('new_message', message); // Also broadcast to all clients
    }

    // Respond with empty TwiML
    res.type('text/xml').send('<Response></Response>');
  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);
    next(error);
  }
}
