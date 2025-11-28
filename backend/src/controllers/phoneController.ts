import { Request, Response, NextFunction } from 'express';
import { phoneService } from '../services';
import { createError } from '../middleware';

export async function getAllPhones(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const phones = await phoneService.getAllPhones();
    res.json({
      success: true,
      data: phones,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPhoneById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const phone = await phoneService.getPhoneById(id);

    if (!phone) {
      throw createError('Phone number not found', 404);
    }

    res.json({
      success: true,
      data: phone,
    });
  } catch (error) {
    next(error);
  }
}

export async function createPhone(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { number, country, countryCode } = req.body;

    if (!number || !country || !countryCode) {
      throw createError('Missing required fields: number, country, countryCode', 400);
    }

    const phone = await phoneService.createPhone({
      number,
      country,
      countryCode,
    });

    res.status(201).json({
      success: true,
      data: phone,
    });
  } catch (error) {
    next(error);
  }
}

export async function deletePhone(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    
    const phone = await phoneService.getPhoneById(id);
    if (!phone) {
      throw createError('Phone number not found', 404);
    }

    await phoneService.deletePhone(id);

    res.json({
      success: true,
      message: 'Phone number deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
