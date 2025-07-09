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

export class CreateCommentDto {
  @ApiProperty({
    description: 'The content of the comment',
    example:
      'This anomaly requires immediate attention due to safety concerns.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'The author of the comment',
    example: 'john.doe',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  author: string;

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
    description: 'The date when the comment was created (ISO string)',
    example: '2025-07-07T10:30:00Z',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  createdAt?: Date;
}

export class CommentResponse {
  @ApiProperty({
    description: 'The unique identifier for the comment',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'The content of the comment',
    example:
      'This anomaly requires immediate attention due to safety concerns.',
    type: String,
  })
  content: string;

  @ApiProperty({
    description: 'The author of the comment',
    example: 'john.doe',
    type: String,
  })
  author: string;

  @ApiProperty({
    description: 'The date when the comment was created',
    example: '2025-07-07T10:30:00Z',
    type: String,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The ID of the associated anomaly',
    example: 1,
    type: Number,
  })
  anomalyId: number;
}
