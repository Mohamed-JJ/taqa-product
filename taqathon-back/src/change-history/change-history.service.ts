import { Injectable } from '@nestjs/common';
import { CreateChangeHistoryDto } from './dto/create-change-history.dto';
import { UpdateChangeHistoryDto } from './dto/update-change-history.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChangeHistoryService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createChangeHistoryDto: Prisma.changeHistoryCreateInput) {
    return await this.prismaService.changeHistory.create({
      data: createChangeHistoryDto,
    });
  }

  async findAll() {
    return await this.prismaService.changeHistory.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.changeHistory.findFirst({
      where: { id: id },
    });
  }

  async update(
    id: number,
    updateChangeHistoryDto: Prisma.changeHistoryUpdateInput
  ) {
    return await this.prismaService.changeHistory.update({
      where: { id: id },
      data: updateChangeHistoryDto,
    });
  }

  async remove(id: number) {
    return `This action removes a #${id} changeHistory`;
  }
}
