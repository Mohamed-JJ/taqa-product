import { PartialType } from '@nestjs/swagger';
import { CreateMaintenanceWindowDto } from './create-maintenance-window.dto';

export class UpdateMaintenanceWindowDto extends PartialType(
  CreateMaintenanceWindowDto
) {}
