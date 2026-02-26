import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class FilterSchedulesDto {
  @ApiPropertyOptional({
    example: '2025-03-01',
    description: 'Filter schedules with departure on or after this date (ISO)',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    example: '2025-03-31',
    description: 'Filter schedules with departure on or before this date (ISO)',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({
    example: 'Kyiv - Lviv',
    description: 'Filter by route name (case-insensitive contains)',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  routeName?: string;

  @ApiPropertyOptional({
    description: 'Filter by train type ID',
  })
  @IsOptional()
  @IsUUID()
  trainTypeId?: string;
}
