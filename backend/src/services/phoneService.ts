import prisma from '../config/database';
import { PhoneNumber } from '@prisma/client';

export class PhoneService {
  async getAllPhones(): Promise<PhoneNumber[]> {
    return prisma.phoneNumber.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPhoneById(id: string): Promise<PhoneNumber | null> {
    return prisma.phoneNumber.findUnique({
      where: { id },
    });
  }

  async getPhoneByNumber(number: string): Promise<PhoneNumber | null> {
    return prisma.phoneNumber.findUnique({
      where: { number },
    });
  }

  async createPhone(data: {
    number: string;
    country: string;
    countryCode: string;
  }): Promise<PhoneNumber> {
    return prisma.phoneNumber.create({
      data,
    });
  }

  async updatePhone(
    id: string,
    data: Partial<Pick<PhoneNumber, 'isActive' | 'country' | 'countryCode'>>
  ): Promise<PhoneNumber> {
    return prisma.phoneNumber.update({
      where: { id },
      data,
    });
  }

  async deletePhone(id: string): Promise<void> {
    await prisma.phoneNumber.delete({
      where: { id },
    });
  }
}

export const phoneService = new PhoneService();
export default phoneService;
