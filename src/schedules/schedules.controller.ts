import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@ApiTags('schedules')
@ApiBearerAuth()
@Controller('schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchedulesController {
  constructor(private schedulesService: SchedulesService) {}

  @Get()
  @Roles(Role.Admin, Role.User)
  @ApiOperation({ summary: 'List all schedules' })
  @ApiResponse({ status: 200, description: 'List of schedules' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll() {
    return this.schedulesService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({ summary: 'Get schedule by id' })
  @ApiResponse({ status: 200, description: 'Schedule' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create a schedule (admin)' })
  @ApiBody({ type: CreateScheduleDto })
  @ApiResponse({ status: 201, description: 'Schedule created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() dto: CreateScheduleDto) {
    return this.schedulesService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update schedule (admin)' })
  @ApiBody({ type: UpdateScheduleDto })
  @ApiResponse({ status: 200, description: 'Schedule updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  update(@Param('id') id: string, @Body() dto: UpdateScheduleDto) {
    return this.schedulesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete schedule (admin)' })
  @ApiResponse({ status: 200, description: 'Schedule deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(id);
  }
}
