import { Module } from '@nestjs/common';
import { ChangeHistoryService } from './change-history.service';
import { ChangeHistoryController } from './change-history.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ChangeHistoryController],
  providers: [ChangeHistoryService, PrismaService],
})
export class ChangeHistoryModule {}
