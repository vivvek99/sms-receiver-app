import { Request, Response, NextFunction } from 'express';
import twilio from 'twilio';
import config from '../config';

export function validateTwilioWebhook(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Skip validation in development or if disabled
  if (!config.twilio.validateWebhook || config.nodeEnv === 'development') {
    return next();
  }

  const twilioSignature = req.headers['x-twilio-signature'] as string;
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  const isValid = twilio.validateRequest(
    config.twilio.authToken,
    twilioSignature,
    url,
    req.body
  );

  if (!isValid) {
    res.status(403).json({
      success: false,
      error: 'Invalid Twilio signature',
    });
    return;
  }

  next();
}
