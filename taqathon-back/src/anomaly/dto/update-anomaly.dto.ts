import { PartialType } from '@nestjs/swagger';
import { CreateAnomalyDto } from './create-anomaly.dto';

export class UpdateAnomalyDto extends PartialType(CreateAnomalyDto) {}
