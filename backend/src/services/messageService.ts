import prisma from '../config/database';
import { Message } from '@prisma/client';

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class MessageService {
  async getMessagesByPhoneId(
    phoneNumberId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedResult<Message>> {
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { phoneNumberId },
        orderBy: { receivedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.message.count({
        where: { phoneNumberId },
      }),
    ]);

    return {
      data: messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getMessageById(id: string): Promise<Message | null> {
    return prisma.message.findUnique({
      where: { id },
    });
  }

  async createMessage(data: {
    from: string;
    to: string;
    body: string;
    twilioSid?: string;
    phoneNumberId: string;
  }): Promise<Message> {
    return prisma.message.create({
      data,
    });
  }

  async deleteMessage(id: string): Promise<void> {
    await prisma.message.delete({
      where: { id },
    });
  }

  async getRecentMessages(limit: number = 10): Promise<Message[]> {
    return prisma.message.findMany({
      orderBy: { receivedAt: 'desc' },
      take: limit,
    });
  }
}

export const messageService = new MessageService();
export default messageService;
