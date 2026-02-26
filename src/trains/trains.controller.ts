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

@ApiTags('trains')
@ApiBearerAuth()
@Controller('trains')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrainsController {
  constructor(private trainsService: TrainsService) {}

  @Get()
  @Roles(Role.Admin, Role.User)
  @ApiOperation({ summary: 'List all trains (with train type)' })
  @ApiResponse({
    status: 200,
    description: 'List of trains for dropdown / display',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll() {
    return this.trainsService.findAll();
  }
}
