import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { writeFileSync } from 'node:fs';

@Injectable()
export class AttachementsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createAttachementDto: Prisma.attachmentsCreateInput) {
    return await this.prismaService.attachments.create({
      data: createAttachementDto,
    });
  }

  async findAll() {
    return await this.prismaService.attachments.findMany({
      include: {
        anomaly: {
          select: {
            id: true,
            description: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prismaService.attachments.findUnique({
      where: { id: id },
      include: {
        anomaly: {
          select: {
            id: true,
            description: true,
          },
        },
      },
    });
  }

  async update(
    id: number,
    updateAttachementDto: Prisma.attachmentsUpdateInput
  ) {
    return await this.prismaService.attachments.update({
      where: { id: id },
      data: updateAttachementDto,
    });
  }

  async remove(id: number) {
    return await this.prismaService.attachments.delete({ where: { id: id } });
  }

  save_to_local_dir(path: string, payload: Buffer) {
    try {
      writeFileSync(path, payload);
      return true;
    } catch (error: unknown) {
      console.log('error', error);
      return false;
    }
  }

  async findAnomalyById(
    id: number
  ): Promise<{ id: number; rexFilePath: string | null } | null> {
    return await this.prismaService.anomaly.findUnique({
      where: { id: id },
      select: {
        id: true,
        rexFilePath: true,
      },
    });
  }

  async updateAnomalyRexPath(anomalyId: number, rexFilePath: string) {
    return await this.prismaService.anomaly.update({
      where: { id: anomalyId },
      data: { rexFilePath: rexFilePath },
    });
  }

  async findAllRexAttachments(
    page: number = 1,
    limit: number = 10,
    search?: string
  ) {
    const skip = (page - 1) * limit;

    const where = {
      rexFilePath: {
        not: null,
      },
      ...(search && {
        description: {
          contains: search,
          mode: 'insensitive' as const,
        },
      }),
    };

    const [data, total] = await Promise.all([
      this.prismaService.anomaly.findMany({
        where,
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prismaService.anomaly.count({
        where,
      }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }
}
