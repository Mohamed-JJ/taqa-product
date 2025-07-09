import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsPositive,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateChangeHistoryDto {
  @ApiProperty({
    description: 'The field name that was changed',
    example: 'status',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  field: string;

  @ApiProperty({
    description: 'The old value before the change',
    example: 'in-progress',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  oldvalue: string;

  @ApiProperty({
    description: 'The new value after the change',
    example: 'resolved',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  newValue: string;

  @ApiProperty({
    description: 'The user who made the change',
    example: 'john.doe',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  changedBy: string;

  @ApiProperty({
    description: 'The reason for the change',
    example: 'Issue has been resolved after maintenance work',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({
    description: 'The ID of the associated anomaly',
    example: 1,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  anomalyId: number;

  @ApiPropertyOptional({
    description: 'The date when the change was made (ISO string)',
    example: '2025-07-07T10:30:00Z',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  changedAt?: Date;
}

export class ChangeHistoryResponse {
  @ApiProperty({
    description: 'The unique identifier for the change history record',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'The field name that was changed',
    example: 'status',
    type: String,
  })
  field: string;

  @ApiProperty({
    description: 'The old value before the change',
    example: 'in-progress',
    type: String,
  })
  oldvalue: string;

  @ApiProperty({
    description: 'The new value after the change',
    example: 'resolved',
    type: String,
  })
  newValue: string;

  @ApiProperty({
    description: 'The user who made the change',
    example: 'john.doe',
    type: String,
  })
  changedBy: string;

  @ApiProperty({
    description: 'The date when the change was made',
    example: '2025-07-07T10:30:00Z',
    type: String,
  })
  changedAt: Date;

  @ApiProperty({
    description: 'The reason for the change',
    example: 'Issue has been resolved after maintenance work',
    type: String,
  })
  reason: string;

  @ApiProperty({
    description: 'The ID of the associated anomaly',
    example: 1,
    type: Number,
  })
  anomalyId: number;
}
