import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/interfaces';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@ApiTags('favorites')
@ApiBearerAuth()
@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'List my favorite schedules' })
  @ApiResponse({ status: 200, description: 'List of favorites' })
  findAll(@CurrentUser() user: RequestUser) {
    return this.favoritesService.findAllByUser(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add a schedule to favorites' })
  @ApiBody({ type: CreateFavoriteDto })
  @ApiResponse({ status: 201, description: 'Added to favorites' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  @ApiResponse({ status: 409, description: 'Already in favorites' })
  add(@Body() dto: CreateFavoriteDto, @CurrentUser() user: RequestUser) {
    return this.favoritesService.add(dto.scheduleId, user.id);
  }

  @Delete('schedule/:scheduleId')
  @ApiOperation({ summary: 'Remove a schedule from favorites' })
  @ApiResponse({ status: 200, description: 'Removed from favorites' })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  removeByScheduleId(
    @Param('scheduleId') scheduleId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.favoritesService.removeByScheduleId(scheduleId, user.id);
  }
}
