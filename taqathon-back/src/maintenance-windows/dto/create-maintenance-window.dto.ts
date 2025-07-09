import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateMaintenanceWindowDto {
  @ApiProperty({
    description: 'The title of the maintenance window',
    example: 'Scheduled System Maintenance - Unit 3',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description:
      'The start date and time of the maintenance window (ISO string)',
    example: '2025-07-15T09:00:00Z',
    type: String,
  })
  @IsDateString()
  scheduleStart: Date;

  @ApiProperty({
    description: 'The end date and time of the maintenance window (ISO string)',
    example: '2025-07-15T17:00:00Z',
    type: String,
  })
  @IsDateString()
  scheduleEnd: Date;
}

export class MaintenanceWindowResponse {
  @ApiProperty({
    description: 'The unique identifier for the maintenance window',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'The title of the maintenance window',
    example: 'Scheduled System Maintenance - Unit 3',
    type: String,
  })
  title: string;

  @ApiProperty({
    description: 'The start date and time of the maintenance window',
    example: '2025-07-15T09:00:00Z',
    type: String,
  })
  scheduleStart: Date;

  @ApiProperty({
    description: 'The end date and time of the maintenance window',
    example: '2025-07-15T17:00:00Z',
    type: String,
  })
  scheduleEnd: Date;

  @ApiPropertyOptional({
    description: 'List of anomalies associated with this maintenance window',
    type: Array,
    items: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        status: { type: 'string' },
      },
    },
  })
  anomalies?: any[];
}
