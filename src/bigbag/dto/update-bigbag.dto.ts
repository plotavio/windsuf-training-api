import { PartialType } from '@nestjs/mapped-types';
import { CreateBigbagDto } from './create-bigbag.dto';

export class UpdateBigbagDto extends PartialType(CreateBigbagDto) {}
