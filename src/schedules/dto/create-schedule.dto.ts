import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({ description: 'Train ID' })
  @IsUUID()
  trainId: string;

  @ApiProperty({ example: 'Kyiv - Lviv', description: 'Route name' })
  @IsString()
  @MinLength(1)
  routeName: string;

  @ApiProperty({
    example: '2025-03-01',
    description: 'Departure date (when train leaves)',
  })
  @IsDateString()
  departureDate: string;

  @ApiProperty({
    example: '2025-03-01',
    description: 'Date when train finishes the route',
  })
  @IsDateString()
  finishedDate: string;

  @ApiProperty({
    example: ['Kyiv-Pasazhyrskyi', 'Vinnytsia', 'Lviv'],
    description: 'Station titles (stop names) in order',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  stops: string[];
}
