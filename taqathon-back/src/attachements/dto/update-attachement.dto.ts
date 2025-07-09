import { PartialType } from '@nestjs/swagger';
import { CreateAttachementDto } from './create-attachement.dto';

export class UpdateAttachementDto extends PartialType(CreateAttachementDto) {}
