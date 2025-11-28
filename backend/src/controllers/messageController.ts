import { Request, Response, NextFunction } from 'express';
import { messageService } from '../services';
import { createError } from '../middleware';

export async function getMessagesByPhoneId(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { phoneId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);

    const result = await messageService.getMessagesByPhoneId(phoneId, page, limit);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMessageById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const message = await messageService.getMessageById(id);

    if (!message) {
      throw createError('Message not found', 404);
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
}
