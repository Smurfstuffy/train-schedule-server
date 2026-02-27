import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SchedulesGateway } from './schedules.gateway';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { FilterSchedulesDto } from './dto/filter-schedules.dto';

@Injectable()
export class SchedulesService {
  constructor(
    private prisma: PrismaService,
    private schedulesGateway: SchedulesGateway,
  ) {}

  async create(dto: CreateScheduleDto) {
    await this.ensureTrainExists(dto.trainId);
    const schedule = await this.prisma.schedule.create({
      data: {
        trainId: dto.trainId,
        routeName: dto.routeName,
        departureDate: new Date(dto.departureDate),
        finishedDate: new Date(dto.finishedDate),
        stops: dto.stops,
      },
      include: { train: true },
    });
    this.schedulesGateway.emitCreated(
      schedule as unknown as Record<string, unknown>,
    );
    return schedule;
  }

  async findAll(filters?: FilterSchedulesDto) {
    const where = this.buildWhere(filters);
    return this.prisma.schedule.findMany({
      where,
      include: { train: { include: { trainType: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  private buildWhere(filters?: FilterSchedulesDto): Prisma.ScheduleWhereInput {
    if (!filters) return {};
    const conditions: Prisma.ScheduleWhereInput[] = [];
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      from.setUTCHours(0, 0, 0, 0);
      conditions.push({ departureDate: { gte: from } });
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      to.setUTCHours(23, 59, 59, 999);
      conditions.push({ departureDate: { lte: to } });
    }
    if (filters.routeName?.trim()) {
      conditions.push({
        routeName: { contains: filters.routeName.trim(), mode: 'insensitive' },
      });
    }
    if (filters.trainTypeId) {
      conditions.push({ train: { trainTypeId: filters.trainTypeId } });
    }
    return conditions.length ? { AND: conditions } : {};
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
    const schedule = await this.prisma.schedule.update({
      where: { id },
      data,
      include: { train: true },
    });
    this.schedulesGateway.emitUpdated(
      schedule as unknown as Record<string, unknown>,
    );
    return schedule;
  }

  async remove(id: string) {
    await this.findOne(id);
    const schedule = await this.prisma.schedule.delete({
      where: { id },
      include: { train: true },
    });
    this.schedulesGateway.emitDeleted(id);
    return schedule;
  }

  private async ensureTrainExists(trainId: string) {
    const train = await this.prisma.train.findUnique({
      where: { id: trainId },
    });
    if (!train) throw new ConflictException('Train not found');
  }
}
