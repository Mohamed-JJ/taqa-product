import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MaintenanceWindowsService } from 'src/maintenance-windows/maintenance-windows.service';
@Injectable()
export class AnomalyService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => MaintenanceWindowsService))
    private readonly maintenanceWindowsService: MaintenanceWindowsService
  ) {}
  async create(createAnomalyDto: Prisma.AnomalyCreateInput) {
    const anomaly = await this.prismaService.anomaly.create({
      data: createAnomalyDto,
    });
    await this.maintenanceWindowsService.updateAnomaliesMaintenanceWindow();
    return anomaly;
  }

  async findAll(criticality: string = 'default') {
    const whereClause: Prisma.AnomalyWhereInput = {};

    // Default criticality filter (highest criticality only >= 9)
    if (criticality === 'default' || !criticality) {
      whereClause.criticality = { gte: 9 };
    } else if (criticality !== 'all') {
      const criticalityValue = parseFloat(criticality);
      if (!isNaN(criticalityValue)) {
        whereClause.criticality = { gte: criticalityValue };
      } else {
        // Handle named criticality levels
        switch (criticality) {
          case 'critical':
            whereClause.criticality = { gt: 9 };
            break;
          case 'high':
            whereClause.criticality = { gte: 7, lte: 9 };
            break;
          case 'medium':
            whereClause.criticality = { gte: 3, lte: 6 };
            break;
          default:
            // Invalid criticality value, use default (>=9)
            whereClause.criticality = { gte: 9 };
            break;
        }
      }
    }
    // If criticality === 'all', no criticality filter is applied

    const anomalies = await this.prismaService.anomaly.findMany({
      where: whereClause,
      orderBy: {
        criticality: 'desc',
      },
    });
    return anomalies;
  }

  async findAllPagination(
    page: number = 1,
    limit: number = 10,
    criticality: string = 'default'
  ) {
    const skip = (page - 1) * limit;

    const whereClause: Prisma.AnomalyWhereInput = {};

    // Default criticality filter (highest criticality only >= 9)
    if (criticality === 'default' || !criticality) {
      whereClause.criticality = { gte: 9 };
    } else if (criticality !== 'all') {
      const criticalityValue = parseFloat(criticality);
      if (!isNaN(criticalityValue)) {
        whereClause.criticality = { gte: criticalityValue };
      } else {
        // Handle named criticality levels
        switch (criticality) {
          case 'critical':
            whereClause.criticality = { gt: 9 };
            break;
          case 'high':
            whereClause.criticality = { gte: 7, lte: 9 };
            break;
          case 'medium':
            whereClause.criticality = { gte: 3, lte: 6 };
            break;
          default:
            // Invalid criticality value, use default (>=9)
            whereClause.criticality = { gte: 9 };
            break;
        }
      }
    }
    // If criticality === 'all', no criticality filter is applied

    const [anomalies, total] = await Promise.all([
      this.prismaService.anomaly.findMany({
        where: whereClause,
        skip,
        take: parseInt(limit.toString()),
        orderBy: {
          criticality: 'desc',
        },
      }),
      this.prismaService.anomaly.count({
        where: whereClause,
      }),
    ]);

    // Ceil the float values in the anomalies data
    const ceiledAnomalies = anomalies.map((anomaly) => ({
      ...anomaly,
      criticality:
        anomaly.criticality !== null ? Math.ceil(anomaly.criticality) : null,
      predictedDisponibility:
        anomaly.predictedDisponibility !== null
          ? Math.ceil(anomaly.predictedDisponibility)
          : null,
      predictedIntegrity:
        anomaly.predictedIntegrity !== null
          ? Math.ceil(anomaly.predictedIntegrity)
          : null,
      integrity:
        anomaly.integrity !== null ? Math.ceil(anomaly.integrity) : null,
    }));

    const inProgressAnomamies = await this.prismaService.anomaly.count({
      where: { status: AStatus.IN_PROGRESS },
    });
    const treatedAnomamies = await this.prismaService.anomaly.count({
      where: { status: AStatus.TREATED },
    });
    const closedAnomamies = await this.prismaService.anomaly.count({
      where: { status: AStatus.CLOSED },
    });
    const criticalAnomamies = await this.prismaService.anomaly.count({
      where: { criticality: { gt: 9 } },
    });

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data: ceiledAnomalies,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
      anomaliesData: {
        inProgress: inProgressAnomamies,
        treatedAnomalies: treatedAnomamies,
        criticalAnomalies: criticalAnomamies,
        closedAnomalies: closedAnomamies,
      },
    };
  }

  async findAllSearchPagination(
    page: number = 1,
    limit: number = 10,
    q: string | null = null,
    description: string | null = null,
    equipment: string | null = null,
    detectionDate: string | null = null,
    system: string | null = null,
    service: string | null = null,
    sysShutDownRequired: boolean | string | null = null,
    status: string | null = null,
    criticality: string | null = null,
    sortOrder: string = 'desc'
  ) {
    const skip = (page - 1) * limit;

    // Build the where clause for filtering
    const whereClause: Prisma.AnomalyWhereInput = {};

    // Add search filter if provided (searches across multiple fields)
    if (q) {
      whereClause.OR = [
        { description: { contains: q } },
        { equipementDescription: { contains: q } },
        { equipment: { contains: q } },
        { service: { contains: q } },
        { system: { contains: q } },
        // { status: { contains: q } },
      ];
    }

    // Add specific field filters
    if (description) {
      whereClause.description = { contains: description };
    }

    if (equipment) {
      whereClause.equipment = { contains: equipment };
    }

    if (detectionDate) {
      // Parse the date and create a date range for the entire day
      const startDate = new Date(detectionDate);
      const endDate = new Date(detectionDate);
      endDate.setHours(23, 59, 59, 999);
      whereClause.detectionDate = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (system) {
      whereClause.system = { contains: system };
    }

    if (service) {
      whereClause.service = { contains: service };
    }

    if (sysShutDownRequired !== null) {
      // Convert string 'true'/'false' to boolean
      const boolValue =
        sysShutDownRequired === true || sysShutDownRequired === 'true';
      whereClause.sysShutDownRequired = boolValue;
    }

    if (status) {
      whereClause.status = status as AStatus; // Cast to match Prisma enum
    }

    // Default criticality filter (highest criticality only >= 9)
    // This can be overridden by the criticality parameter
    if (criticality === 'default' || !criticality) {
      whereClause.criticality = { gte: 9 };
    } else if (criticality !== 'all') {
      const criticalityValue = parseFloat(criticality);
      if (!isNaN(criticalityValue)) {
        whereClause.criticality = { gte: criticalityValue };
      } else {
        // Handle named criticality levels
        switch (criticality) {
          case 'critical':
            whereClause.criticality = { gt: 9 };
            break;
          case 'high':
            whereClause.criticality = { gte: 7, lte: 9 };
            break;
          case 'medium':
            whereClause.criticality = { gte: 3, lte: 6 };
            break;
          default:
            // Invalid criticality value, use default (>=9)
            whereClause.criticality = { gte: 9 };
            break;
        }
      }
    }
    // If criticality === 'all', no criticality filter is applied

    // Validate and set sort order
    const validSortOrder =
      sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : 'desc';

    const [anomalies, total] = await Promise.all([
      this.prismaService.anomaly.findMany({
        where: whereClause,
        skip,
        take: parseInt(limit.toString()),
        orderBy: {
          criticality: validSortOrder,
        },
      }),
      this.prismaService.anomaly.count({
        where: whereClause,
      }),
    ]);

    // Ceil the float values in the anomalies data
    const ceiledAnomalies = anomalies.map((anomaly) => ({
      ...anomaly,
      criticality:
        anomaly.criticality !== null ? Math.ceil(anomaly.criticality) : null,
      predictedDisponibility:
        anomaly.predictedDisponibility !== null
          ? Math.ceil(anomaly.predictedDisponibility)
          : null,
      predictedIntegrity:
        anomaly.predictedIntegrity !== null
          ? Math.ceil(anomaly.predictedIntegrity)
          : null,
      integrity:
        anomaly.integrity !== null ? Math.ceil(anomaly.integrity) : null,
    }));

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    const inProgressAnomamies = await this.prismaService.anomaly.count({
      where: { status: AStatus.IN_PROGRESS },
    });
    const treatedAnomamies = await this.prismaService.anomaly.count({
      where: { status: AStatus.TREATED },
    });
    const closedAnomamies = await this.prismaService.anomaly.count({
      where: { status: AStatus.CLOSED },
    });
    const criticalAnomamies = await this.prismaService.anomaly.count({
      where: { criticality: { gt: 9 } },
    });
    return {
      data: ceiledAnomalies,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
      anomaliesData: {
        inProgress: inProgressAnomamies,
        treatedAnomalies: treatedAnomamies,
        criticalAnomalies: criticalAnomamies,
        closedAnomalies: closedAnomamies,
      },
    };
  }

  async findOne(id: number) {
    const anomaly = await this.prismaService.anomaly.findFirst({
      where: { id: id },
      include: {
        attachements: true,
      },
    });
    return anomaly;
  }

  async findAllForMaintenanceWindow(
    time: number,
    criticality: string = 'default'
  ) {
    const whereClause: Prisma.AnomalyWhereInput = {
      maintenanceWindowId: null,
      sysShutDownRequired: true,
      estimatedTime: {
        lte: time,
      },
    };

    // Default criticality filter (highest criticality only >= 9)
    if (criticality === 'default' || !criticality) {
      whereClause.criticality = { gte: 9 };
    } else if (criticality !== 'all') {
      const criticalityValue = parseFloat(criticality);
      if (!isNaN(criticalityValue)) {
        whereClause.criticality = { gte: criticalityValue };
      } else {
        // Handle named criticality levels
        switch (criticality) {
          case 'critical':
            whereClause.criticality = { gt: 9 };
            break;
          case 'high':
            whereClause.criticality = { gte: 7, lte: 9 };
            break;
          case 'medium':
            whereClause.criticality = { gte: 3, lte: 6 };
            break;
          default:
            // Invalid criticality value, use default (>=9)
            whereClause.criticality = { gte: 9 };
            break;
        }
      }
    }
    // If criticality === 'all', no criticality filter is applied

    const anomalies = await this.prismaService.anomaly.findMany({
      where: whereClause,
      orderBy: {
        criticality: 'desc',
      },
    });
    return anomalies;
  }

  async update(id: number, updateAnomalyDto: Prisma.AnomalyUpdateInput) {
    const currentAnomaly = await this.prismaService.anomaly.findUnique({
      where: { id },
      select: {
        sysShutDownRequired: true,
        maintenanceWindowId: true,
      },
    });

    if (!currentAnomaly) {
      throw new NotFoundException(`Anomaly with ID ${id} not found`);
    }

    // ✅ Check if the status is being updated to COMPLETED
    const isStatusClosed =
      typeof updateAnomalyDto.status === 'object' &&
      updateAnomalyDto.status?.set === AStatus.CLOSED;

    if (isStatusClosed) {
      console.log(`Anomaly ${id} is being marked as COMPLETED.`);
      // Add your custom logic for COMPLETED status here
    }

    // Check if sysShutDownRequired is being set to false
    const isSettingShutDownToFalse =
      updateAnomalyDto.sysShutDownRequired === false;

    if (isSettingShutDownToFalse && currentAnomaly.maintenanceWindowId) {
      updateAnomalyDto.maintenanceWindow = { disconnect: true };
      updateAnomalyDto.forcedAssigned = true;

      console.log(
        `Removing anomaly ${id} from maintenance window ${currentAnomaly.maintenanceWindowId} due to sysShutDownRequired = false`
      );
    }

    const updateAnomaly = await this.prismaService.anomaly.update({
      where: { id: id },
      data: updateAnomalyDto,
    });

    await this.maintenanceWindowsService.updateAnomaliesMaintenanceWindow();

    return updateAnomaly;
  }

  async remove(id: number) {
    try {
      const removeAnomaly = await this.prismaService.anomaly.delete({
        where: { id: id },
      });
      await this.maintenanceWindowsService.updateAnomaliesMaintenanceWindow();
      return removeAnomaly;
    } catch (error) {
      console.error('Remove failed:', error);
      throw new HttpException('remove failed', HttpStatus.BAD_REQUEST);
    }
  }

  async addAttach(anomalyId: number, filename: string) {
    const anomaly = await this.prismaService.anomaly.findUnique({
      where: { id: anomalyId },
    });

    if (!anomaly) {
      throw new NotFoundException(`Anomaly with ID ${anomalyId} not found`);
    }

    return this.prismaService.attachments.create({
      data: {
        name: filename,
        anomalyId,
      },
    });
  }

  async findAllByServiceAndMonth(
    service?: string,
    month?: number,
    year?: number,
    criticality: string = 'default'
  ) {
    const whereClause: Prisma.AnomalyWhereInput = {};

    // Default criticality filter (highest criticality only >= 9)
    if (criticality === 'default' || !criticality) {
      whereClause.criticality = { gte: 9 };
    } else if (criticality !== 'all') {
      const criticalityValue = parseFloat(criticality);
      if (!isNaN(criticalityValue)) {
        whereClause.criticality = { gte: criticalityValue };
      } else {
        // Handle named criticality levels
        switch (criticality) {
          case 'critical':
            whereClause.criticality = { gt: 9 };
            break;
          case 'high':
            whereClause.criticality = { gte: 7, lte: 9 };
            break;
          case 'medium':
            whereClause.criticality = { gte: 3, lte: 6 };
            break;
          default:
            // Invalid criticality value, use default (>=9)
            whereClause.criticality = { gte: 9 };
            break;
        }
      }
    }
    // If criticality === 'all', no criticality filter is applied

    // Add service filter if provided
    if (service) {
      whereClause.service = { contains: service };
    }

    // Add month/year filter if provided
    if (month !== undefined) {
      const currentYear = year || new Date().getFullYear();
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 0, 23, 59, 59);

      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    return await this.prismaService.anomaly.findMany({
      where: whereClause,
      orderBy: {
        criticality: 'desc',
      },
    });
  }

  async getAnomaliesByMonthInYear(
    service?: string,
    year?: number,
    criticality: string = 'default'
  ) {
    const targetYear = year || new Date().getFullYear();
    const monthlyData: { month: number; monthName: string; count: number }[] =
      [];

    for (let month = 1; month <= 12; month++) {
      const whereClause: Prisma.AnomalyWhereInput = {};

      // Default criticality filter (highest criticality only >= 9)
      if (criticality === 'default' || !criticality) {
        whereClause.criticality = { gte: 9 };
      } else if (criticality !== 'all') {
        const criticalityValue = parseFloat(criticality);
        if (!isNaN(criticalityValue)) {
          whereClause.criticality = { gte: criticalityValue };
        } else {
          // Handle named criticality levels
          switch (criticality) {
            case 'critical':
              whereClause.criticality = { gt: 9 };
              break;
            case 'high':
              whereClause.criticality = { gte: 7, lte: 9 };
              break;
            case 'medium':
              whereClause.criticality = { gte: 3, lte: 6 };
              break;
            default:
              // Invalid criticality value, use default (>=9)
              whereClause.criticality = { gte: 9 };
              break;
          }
        }
      }
      // If criticality === 'all', no criticality filter is applied

      // Add service filter if provided
      if (service) {
        whereClause.service = { contains: service };
      }

      // Add month/year filter
      const startDate = new Date(targetYear, month - 1, 1);
      const endDate = new Date(targetYear, month, 0, 23, 59, 59);

      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };

      const count = await this.prismaService.anomaly.count({
        where: whereClause,
      });

      monthlyData.push({
        month,
        monthName: new Date(targetYear, month - 1, 1).toLocaleString('en-US', {
          month: 'long',
        }),
        count,
      });
    }

    return monthlyData;
  }
}
