import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createCommentDto: Prisma.commentsCreateInput) {
    return await this.prismaService.comments.create({ data: createCommentDto });
  }

  async findAll() {
    return await this.prismaService.comments.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.comments.findFirst({ where: { id: id } });
  }

  async update(id: number, updateCommentDto: Prisma.commentsUpdateInput) {
    return await this.prismaService.comments.update({
      where: { id: id },
      data: updateCommentDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
