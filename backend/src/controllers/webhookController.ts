import { Request, Response, NextFunction } from 'express';
import { phoneService, messageService } from '../services';
import { Server as SocketIOServer } from 'socket.io';

// Socket.IO instance management using singleton pattern
class SocketManager {
  private static instance: SocketIOServer | null = null;

  static setInstance(io: SocketIOServer): void {
    SocketManager.instance = io;
  }

  static getInstance(): SocketIOServer | null {
    return SocketManager.instance;
  }
}

export function setSocketIO(socketIO: SocketIOServer): void {
  SocketManager.setInstance(socketIO);
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

    // Emit to connected WebSocket clients who subscribed to this phone
    const io = SocketManager.getInstance();
    if (io) {
      io.to(`phone:${phone.id}`).emit('new_message', message);
    }

    // Respond with empty TwiML
    res.type('text/xml').send('<Response></Response>');
  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);
    next(error);
  }
}
