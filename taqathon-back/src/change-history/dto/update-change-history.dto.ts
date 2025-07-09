import { PartialType } from '@nestjs/swagger';
import { CreateChangeHistoryDto } from './create-change-history.dto';

export class UpdateChangeHistoryDto extends PartialType(
  CreateChangeHistoryDto
) {}
