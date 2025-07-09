import { forwardRef, Module } from '@nestjs/common';
import { MaintenanceWindowsService } from './maintenance-windows.service';
import { MaintenanceWindowsController } from './maintenance-windows.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnomalyService } from 'src/anomaly/anomaly.service';
import { AnomalyModule } from 'src/anomaly/anomaly.module';

@Module({
  controllers: [MaintenanceWindowsController],
  // exports: [MaintenanceWindowsService],
  imports: [forwardRef(() => AnomalyModule)],
  providers: [MaintenanceWindowsService, PrismaService, AnomalyService],
})
export class MaintenanceWindowsModule {}
