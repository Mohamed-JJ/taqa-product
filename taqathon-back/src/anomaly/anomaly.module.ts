import { forwardRef, Module } from '@nestjs/common';
import { AnomalyService } from './anomaly.service';
import { AnomalyController } from './anomaly.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MaintenanceWindowsService } from 'src/maintenance-windows/maintenance-windows.service';
import { MaintenanceWindowsModule } from 'src/maintenance-windows/maintenance-windows.module';

@Module({
  controllers: [AnomalyController],
  imports: [forwardRef(() => MaintenanceWindowsModule)],
  providers: [AnomalyService, PrismaService, MaintenanceWindowsService],
})
export class AnomalyModule {}
