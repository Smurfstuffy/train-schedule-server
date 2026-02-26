import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateFavoriteDto {
  @ApiProperty({ description: 'Schedule ID to add to favorites' })
  @IsUUID()
  scheduleId: string;
}
