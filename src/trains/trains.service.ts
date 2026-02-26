import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrainsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.train.findMany({
      include: { trainType: true },
      orderBy: [{ trainType: { name: 'asc' } }, { trainTitle: 'asc' }],
    });
  }

  findAllTypes() {
    return this.prisma.trainType.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
