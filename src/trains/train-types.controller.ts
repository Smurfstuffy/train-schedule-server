import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { TrainsService } from './trains.service';

@ApiTags('train-types')
@ApiBearerAuth()
@Controller('train-types')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrainTypesController {
  constructor(private trainsService: TrainsService) {}

  @Get()
  @Roles(Role.Admin, Role.User)
  @ApiOperation({ summary: 'List all train types (for filter dropdown)' })
  @ApiResponse({ status: 200, description: 'List of train types' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll() {
    return this.trainsService.findAllTypes();
  }
}
