import { Module } from '@nestjs/common';
import { AttachementsService } from './attachements.service';
import { AttachementsController } from './attachements.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AttachementsController],
  providers: [AttachementsService, PrismaService],
})
export class AttachementsModule {}
