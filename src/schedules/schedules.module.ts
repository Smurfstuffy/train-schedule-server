import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { SchedulesGateway } from './schedules.gateway';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SchedulesController],
  providers: [SchedulesGateway, SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}
