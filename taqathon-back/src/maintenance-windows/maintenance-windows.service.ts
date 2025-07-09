import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AnomalyService } from 'src/anomaly/anomaly.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MaintenanceWindowsService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => AnomalyService))
    private readonly anomalyService: AnomalyService
  ) {}

  // Check for overlapping maintenance windows
  private async checkForOverlaps(
    scheduleStart: Date,
    scheduleEnd: Date,
    excludeId?: number
  ) {
    const overlappingWindows =
      await this.prismaService.maintenanceWindows.findMany({
        where: {
          ...(excludeId && { id: { not: excludeId } }), // Exclude current window when updating
          OR: [
            // New window starts during existing window
            {
              AND: [
                { scheduleStart: { lte: scheduleStart } },
                { scheduleEnd: { gt: scheduleStart } },
              ],
            },
            // New window ends during existing window
            {
              AND: [
                { scheduleStart: { lt: scheduleEnd } },
                { scheduleEnd: { gte: scheduleEnd } },
              ],
            },
            // New window completely contains existing window
            {
              AND: [
                { scheduleStart: { gte: scheduleStart } },
                { scheduleEnd: { lte: scheduleEnd } },
              ],
            },
            // Existing window completely contains new window
            {
              AND: [
                { scheduleStart: { lte: scheduleStart } },
                { scheduleEnd: { gte: scheduleEnd } },
              ],
            },
          ],
        },
        select: {
          id: true,
          title: true,
          scheduleStart: true,
          scheduleEnd: true,
          status: true,
        },
      });

    return overlappingWindows;
  }

  async create(
    createMaintenanceWindowDto: Prisma.MaintenanceWindowsCreateInput
  ) {
    // Check for overlaps before creating
    const overlappingWindows = await this.checkForOverlaps(
      createMaintenanceWindowDto.scheduleStart as Date,
      createMaintenanceWindowDto.scheduleEnd as Date
    );

    if (overlappingWindows.length > 0) {
      throw new Error(
        `Cannot create maintenance window. The following maintenance windows have overlapping schedules:\n${overlappingWindows
          .map(
            (window) =>
              `- "${window.title}" (ID: ${window.id}) from ${window.scheduleStart.toISOString()} to ${window.scheduleEnd.toISOString()}`
          )
          .join('\n')}`
      );
    }

    const res = await this.prismaService.maintenanceWindows.create({
      data: createMaintenanceWindowDto,
    });
    await this.updateAnomaliesMaintenanceWindow();
    return res;
  }

  async count() {
    return await this.prismaService.maintenanceWindows.count();
  }

  async findAll() {
    return await this.prismaService.maintenanceWindows.findMany({
      orderBy: {
        scheduleStart: 'asc',
      },
      include: {
        anomalies: true, // <--- include related anomalies
      },
    });
  }

  async findOne(id: number) {
    return await this.prismaService.maintenanceWindows.findFirst({
      where: { id },
      include: {
        anomalies: true,
      },
    });
  }

  async update(
    id: number,
    updateMaintenanceWindowDto: Prisma.MaintenanceWindowsUpdateInput
  ) {
    // Check for overlaps before updating if schedule is being changed
    if (
      updateMaintenanceWindowDto.scheduleStart ||
      updateMaintenanceWindowDto.scheduleEnd
    ) {
      // Get current window to fill in missing dates
      const currentWindow =
        await this.prismaService.maintenanceWindows.findUnique({
          where: { id },
          select: { scheduleStart: true, scheduleEnd: true },
        });

      if (!currentWindow) {
        throw new Error('Maintenance window not found');
      }

      const newScheduleStart =
        (updateMaintenanceWindowDto.scheduleStart as Date) ||
        currentWindow.scheduleStart;
      const newScheduleEnd =
        (updateMaintenanceWindowDto.scheduleEnd as Date) ||
        currentWindow.scheduleEnd;

      const overlappingWindows = await this.checkForOverlaps(
        newScheduleStart,
        newScheduleEnd,
        id // Exclude current window from overlap check
      );

      if (overlappingWindows.length > 0) {
        throw new Error(
          `Cannot update maintenance window. The following maintenance windows have overlapping schedules:\n${overlappingWindows
            .map(
              (window) =>
                `- "${window.title}" (ID: ${window.id}) from ${window.scheduleStart.toISOString()} to ${window.scheduleEnd.toISOString()}`
            )
            .join('\n')}`
        );
      }
    }

    const res = await this.prismaService.maintenanceWindows.update({
      where: { id: id },
      data: updateMaintenanceWindowDto,
    });
    await this.updateAnomaliesMaintenanceWindow();
    return res;
  }

  async delAnomalies(id: number, anomalyIds: number[]) {
    // Get the anomalies to be removed for logging/return purposes
    const anomalies = await this.prismaService.anomaly.findMany({
      where: {
        id: {
          in: anomalyIds,
        },
        maintenanceWindowId: id, // Ensure they belong to this maintenance window
      },
      select: {
        id: true,
        estimatedTime: true,
        criticality: true,
        // title: true,
      },
    });
    console.log(id, anomalyIds);
    if (anomalies.length === 0) {
      throw new Error(
        `No anomalies found in maintenance window ${id} with the provided IDs`
      );
    }

    // Calculate total estimated time being removed
    const totalEstimatedTime = anomalies.reduce((total, anomaly) => {
      return total + (anomaly.estimatedTime || 0);
    }, 0);

    console.log(
      `Removing ${anomalies.length} anomalies with total estimated time: ${totalEstimatedTime} hours`
    );
    console.log(`Anomalies being removed:`, anomalies);

    // Disconnect anomalies from maintenance window
    const result = await this.prismaService.maintenanceWindows.update({
      where: { id: id },
      data: {
        anomalies: {
          disconnect: anomalyIds.map((anomalyId) => ({ id: anomalyId })),
        },
      },
    });

    // Update anomaly records to remove maintenance window reference
    await this.prismaService.anomaly.updateMany({
      where: {
        id: {
          in: anomalyIds,
        },
      },
      data: {
        maintenanceWindowId: null,
        forcedAssigned: true, // Reset forced assignment when removing
      },
    });

    return {
      ...result,
      removedAnomalies: anomalies,
      totalEstimatedTimeRemoved: totalEstimatedTime,
      removedCount: anomalies.length,
    };
  }

  async addAnomalies(id: number, anomalyIds: number[]) {
    const maintenanceWindow =
      await this.prismaService.maintenanceWindows.findUnique({
        where: { id: id },
        include: {
          anomalies: {
            select: {
              id: true,
              estimatedTime: true,
            },
          },
        },
      });
    if (
      !maintenanceWindow ||
      !anomalyIds ||
      maintenanceWindow.status === 'COMPLETED'
    ) {
      throw new Error(
        `Maintenance window with id ${id} not found or anomalyIds is undefined`
      );
    }

    const maintenanceWindowTotalTime =
      (new Date(maintenanceWindow.scheduleEnd).getTime() -
        new Date(maintenanceWindow.scheduleStart).getTime()) /
      (1000 * 60 * 60);

    const anomalies = await this.prismaService.anomaly.findMany({
      where: {
        id: {
          in: anomalyIds,
        },
      },
      select: {
        id: true,
        estimatedTime: true,
        criticality: true,
        // title: true,
      },
    });

    const totalEstimatedTime = anomalies.reduce((max, anomaly) => {
      return Math.max(max, anomaly.estimatedTime || 0);
    }, 0);

    if (totalEstimatedTime > maintenanceWindowTotalTime) {
      throw new Error(
        `Not enough time available. Required: ${totalEstimatedTime} hours`
      );
    }

    const result = await this.prismaService.maintenanceWindows.update({
      where: { id: id },
      data: {
        anomalies: {
          connect: anomalyIds.map((anomalyId) => ({ id: anomalyId })),
        },
      },
    });

    await this.prismaService.anomaly.updateMany({
      where: {
        id: {
          in: anomalyIds,
        },
      },
      data: {
        maintenanceWindowId: id,
        forcedAssigned: true,
      },
    });

    return result;
  }

  async remove(id: number) {
    const res = await this.prismaService.maintenanceWindows.delete({
      where: { id: id },
    });
    await this.updateAnomaliesMaintenanceWindow();
    return res;
  }

  async updateAnomaliesMaintenanceWindow() {
    const anomalies = await this.anomalyService.findAll();
    const filteredAnomalies = anomalies
      .filter(
        (item) =>
          item.estimatedTime !== null &&
          item.criticality !== null &&
          item.sysShutDownRequired == true &&
          item.forcedAssigned == false &&
          item.status !== 'CLOSED'
      )
      .map(({ id, estimatedTime, criticality }) => ({
        id,
        estimatedTime,
        criticality,
      }))
      .sort((a, b) => {
        const critA = a.criticality ?? 0;
        const critB = b.criticality ?? 0;
        const timeA = a.estimatedTime ?? 0;
        const timeB = b.estimatedTime ?? 0;

        if (critA !== critB) {
          return critB - critA;
        }
        return timeB - timeA;
      });
    const maintenanceWindows = await this.findAll();
    // console.log(`updateAnomaliesMaintenanceWindow called :${maintenanceWindows}`)
    for (const maintenanceWindow of maintenanceWindows) {
      const time =
        (new Date(maintenanceWindow.scheduleEnd).getTime() -
          new Date(maintenanceWindow.scheduleStart).getTime()) /
        (1000 * 60 * 60);
      const anomaliesToAssign: number[] = [];
      let i = 0;
      while (i < filteredAnomalies.length) {
        const anomaly = filteredAnomalies[i];
        if (time <= 0) break;
        if (anomaly.estimatedTime && anomaly.estimatedTime <= time) {
          anomaliesToAssign.push(anomaly.id);
          filteredAnomalies.splice(i, 1);
          // time -= anomaly.estimatedTime;
        } else {
          i++;
        }
      }
      if (anomaliesToAssign.length > 0) {
        await this.prismaService.maintenanceWindows.update({
          where: { id: maintenanceWindow.id },
          data: {
            anomalies: {
              connect: anomaliesToAssign.map((id) => ({ id })),
            },
          },
        });
        await this.prismaService.anomaly.updateMany({
          where: {
            id: {
              in: anomaliesToAssign,
            },
          },
          data: {
            maintenanceWindowId: maintenanceWindow.id,
          },
        });
      }
      console.log(`${maintenanceWindow.id} : ${anomaliesToAssign}`);
    }
  }
}
