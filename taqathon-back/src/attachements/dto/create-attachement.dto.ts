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

export class CreateAttachementDto {
  @ApiProperty({
    description: 'The name of the attachment file',
    example: 'maintenance_report.pdf',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The MIME type of the attachment',
    example: 'application/pdf',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'The size of the attachment in bytes',
    example: 1024567,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  size: bigint;

  @ApiProperty({
    description: 'The URL or path where the attachment is stored',
    example: '/attachments/maintenance_report.pdf',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: 'The username or identifier of who uploaded the attachment',
    example: 'john.doe',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  uploadedBy: string;

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
    description: 'The date when the attachment was uploaded (ISO string)',
    example: '2025-07-07T10:30:00Z',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  uploadedAt?: Date;
}

export class AttachmentResponse {
  @ApiProperty({
    description: 'The unique identifier for the attachment',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the attachment file',
    example: 'maintenance_report.pdf',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'The MIME type of the attachment',
    example: 'application/pdf',
    type: String,
  })
  type: string;

  @ApiProperty({
    description: 'The size of the attachment in bytes',
    example: 1024567,
    type: Number,
  })
  size: bigint;

  @ApiProperty({
    description: 'The URL or path where the attachment is stored',
    example: '/attachments/maintenance_report.pdf',
    type: String,
  })
  url: string;

  @ApiProperty({
    description: 'The date when the attachment was uploaded',
    example: '2025-07-07T10:30:00Z',
    type: String,
  })
  uploadedAt: Date;

  @ApiProperty({
    description: 'The username or identifier of who uploaded the attachment',
    example: 'john.doe',
    type: String,
  })
  uploadedBy: string;

  @ApiProperty({
    description: 'The ID of the associated anomaly',
    example: 1,
    type: Number,
  })
  anomalyId: number;
}

export class FileUploadResponse {
  @ApiProperty({
    description: 'Success message',
    example: 'attachment saved successfully',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Success status',
    example: true,
    type: Boolean,
  })
  success: boolean;

  @ApiPropertyOptional({
    description: 'The created attachment data',
    type: AttachmentResponse,
  })
  data?: AttachmentResponse;
}
