import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateScheduleDto) {
    await this.ensureTrainExists(dto.trainId);
    return this.prisma.schedule.create({
      data: {
        trainId: dto.trainId,
        routeName: dto.routeName,
        departureDate: new Date(dto.departureDate),
        finishedDate: new Date(dto.finishedDate),
        stops: dto.stops,
      },
      include: { train: true },
    });
  }

  async findAll() {
    return this.prisma.schedule.findMany({
      include: { train: true },
      orderBy: { departureDate: 'asc' },
    });
  }

  async findOne(id: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: { train: true },
    });
    if (!schedule) throw new NotFoundException('Schedule not found');
    return schedule;
  }

  async update(id: string, dto: UpdateScheduleDto) {
    await this.findOne(id);
    if (dto.trainId) await this.ensureTrainExists(dto.trainId);
    const data = {
      ...(dto.trainId !== undefined && { trainId: dto.trainId }),
      ...(dto.routeName !== undefined && { routeName: dto.routeName }),
      ...(dto.departureDate !== undefined && {
        departureDate: new Date(dto.departureDate),
      }),
      ...(dto.finishedDate !== undefined && {
        finishedDate: new Date(dto.finishedDate),
      }),
      ...(dto.stops !== undefined && { stops: dto.stops }),
    };
    return this.prisma.schedule.update({
      where: { id },
      data,
      include: { train: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.schedule.delete({
      where: { id },
      include: { train: true },
    });
  }

  private async ensureTrainExists(trainId: string) {
    const train = await this.prisma.train.findUnique({
      where: { id: trainId },
    });
    if (!train) throw new ConflictException('Train not found');
  }
}
