import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateAnomalyDto {
  @ApiProperty({ example: 'Pump vibration detected' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'The pump is vibrating beyond threshold' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Pump #5' })
  @IsString()
  equipment: string;

  @ApiProperty({
    example: '2025-07-07T08:00:00Z',
    description: 'ISO date string',
  })
  @IsDateString()
  detectionDate: Date;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  responsiblePerson?: string;

  @ApiProperty({ example: 'Open', description: 'Current anomaly status' })
  @IsString()
  status: string;

  @ApiProperty({
    example: 'mechanical,vibration',
    description: 'comma-separated tags',
  })
  @IsString()
  tags: string;

  @ApiProperty({
    example: 4,
    description: 'Estimated time to fix (hours)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  estimatedTime?: number;

  @ApiProperty({ example: 90, required: false })
  @IsOptional()
  @IsInt()
  availability?: number;

  @ApiProperty({ example: 80, required: false })
  @IsOptional()
  @IsInt()
  reliability?: number;

  @ApiProperty({ example: 75, required: false })
  @IsOptional()
  @IsInt()
  safety?: number;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsInt()
  criticality?: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  sysShutDownRequired?: boolean;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Related maintenance window ID',
  })
  @IsOptional()
  @IsInt()
  maintenanceWindowId?: number;
}

export class Anomaly {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  equipment: string;

  @ApiProperty({ description: 'ISO date string' })
  detectionDate: Date;

  @ApiProperty({ required: false })
  responsiblePerson?: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ description: 'comma-separated tags' })
  tags: string;

  @ApiProperty({
    required: false,
    description: 'Estimated time to fix (hours)',
  })
  estimatedTime?: number;

  @ApiProperty({ required: false })
  availability?: number;

  @ApiProperty({ required: false })
  reliability?: number;

  @ApiProperty({ required: false })
  safety?: number;

  @ApiProperty({ required: false })
  criticality?: number;

  @ApiProperty({ required: false, default: false })
  sysShutDownRequired?: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  maintenanceWindowId?: number;
}
// import { ApiProperty } from '@nestjs/swagger';
// import { Anomaly } from './anomaly.class'; // adjust path as needed
// import { MaintenanceWindows } from './maintenance-window.class'; // adjust path as needed

class ImpactMetrics {
  @ApiProperty()
  noRisk: number;

  @ApiProperty()
  minorRisk: number;

  @ApiProperty()
  majorRisk: number;
}

class MonthlyAnomalyCount {
  @ApiProperty()
  month: number;

  @ApiProperty()
  monthName: string;

  @ApiProperty()
  count: number;
}

class TrendAnalysis {
  @ApiProperty()
  thisMonth: number;

  @ApiProperty()
  lastMonth: number;

  @ApiProperty()
  percentageChange: number;
}

export class AnomalyDashboardResponse {
  @ApiProperty()
  totalAnomalies: number;

  @ApiProperty()
  openAnomalies: number;

  @ApiProperty()
  criticalAnomalies: number;

  @ApiProperty()
  highPriorityAnomalies: number;

  @ApiProperty()
  averageResolutionTime: number;

  @ApiProperty({
    example: { 'in-progress': 4, resolved: 10 },
  })
  anomaliesByStatus: Record<string, number>;

  @ApiProperty({
    example: { low: 5, medium: 10, high: 3 },
  })
  anomaliesByCriticality: Record<string, number>;

  @ApiProperty({
    example: { U3: 35, U2: 8, Common: 4 },
  })
  anomaliesByUnit: Record<string, number>;

  @ApiProperty({
    type: ImpactMetrics,
  })
  safetyImpactMetrics: ImpactMetrics;

  @ApiProperty({
    type: ImpactMetrics,
  })
  availabilityImpactMetrics: ImpactMetrics;

  @ApiProperty({
    type: TrendAnalysis,
  })
  trendAnalysis: TrendAnalysis;

  @ApiProperty({
    type: [Anomaly],
  })
  recentAnomalies: Anomaly[];

  //   @ApiProperty({
  //     type: [MaintenanceWindows],
  //   })
  //   upcomingMaintenance: MaintenanceWindows[];

  @ApiProperty({
    example: 85.2,
    description: 'Percentage of maintenance window utilization',
  })
  maintenanceWindowUtilization: number;

  @ApiProperty({
    type: [MonthlyAnomalyCount],
    description: 'Anomaly counts by month for the current or specified year',
  })
  anomalyByMonth: MonthlyAnomalyCount[];
}
