import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { TrainsService } from './trains.service';
import { TrainsController } from './trains.controller';
import { TrainTypesController } from './train-types.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TrainsController, TrainTypesController],
  providers: [TrainsService],
  exports: [TrainsService],
})
export class TrainsModule {}
