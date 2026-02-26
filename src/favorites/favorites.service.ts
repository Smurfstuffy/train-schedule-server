import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async add(scheduleId: string, userId: string) {
    await this.ensureScheduleExists(scheduleId);
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_scheduleId: { userId, scheduleId },
      },
    });
    if (existing) throw new ConflictException('Schedule already in favorites');
    return this.prisma.favorite.create({
      data: { userId, scheduleId },
      include: {
        schedule: { include: { train: { include: { trainType: true } } } },
      },
    });
  }

  async removeByScheduleId(scheduleId: string, userId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_scheduleId: { userId, scheduleId },
      },
    });
    if (!favorite) throw new NotFoundException('Favorite not found');
    return this.prisma.favorite.delete({
      where: { id: favorite.id },
      include: { schedule: { include: { train: true } } },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        schedule: { include: { train: { include: { trainType: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async ensureScheduleExists(scheduleId: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id: scheduleId },
    });
    if (!schedule) throw new NotFoundException('Schedule not found');
  }
}
