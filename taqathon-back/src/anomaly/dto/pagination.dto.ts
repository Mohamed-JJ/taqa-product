import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  IsBoolean,
} from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description:
      'Filter by criticality level. Use "all" to see all anomalies, "default" or omit for highest criticality only (>=9), or specify a number (e.g., "7") for custom threshold',
    example: 'default',
    enum: ['critical', 'high', 'medium', 'all', 'default'],
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  criticality?: string = 'default';
}
export class SearchPaginationDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search query for filtering anomalies',
    example: 'pump failure',
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  q?: string = undefined;

  @ApiPropertyOptional({
    description: 'Filter by description',
    example: 'valve malfunction',
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  description?: string = undefined;

  @ApiPropertyOptional({
    description: 'Filter by equipment',
    example: 'pump-01',
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  equipment?: string = undefined;

  @ApiPropertyOptional({
    description: 'Filter by detection date (YYYY-MM-DD)',
    example: '2024-01-15',
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  detectionDate?: string = undefined;

  @ApiPropertyOptional({
    description: 'Filter by system',
    example: 'heating-system',
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  system?: string = undefined;

  @ApiPropertyOptional({
    description: 'Filter by service',
    example: 'maintenance',
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  service?: string = undefined;

  @ApiPropertyOptional({
    description: 'Filter by system shutdown requirement',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  sysShutDownRequired?: boolean = undefined;

  @ApiPropertyOptional({
    description: 'Filter by anomaly status',
    example: 'IN_PROGRESS',
    enum: ['IN_PROGRESS', 'TREATED', 'CLOSED'],
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  status?: string = undefined;

  @ApiPropertyOptional({
    description:
      'Filter by criticality level. Use "all" to see all anomalies, "default" or omit for highest criticality only (>=9), or specify a number (e.g., "7") for custom threshold',
    example: 'default',
    enum: ['critical', 'high', 'medium', 'all', 'default'],
    default: 'default',
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  criticality?: string = 'default';

  @ApiPropertyOptional({
    description: 'Sort order for criticality',
    example: 'desc',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  sortOrder?: string = 'desc';
}

export class PaginatedResponse<T> {
  @ApiProperty({
    description: 'Array of items for the current page',
  })
  data: T[];

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPrev: boolean;
}
