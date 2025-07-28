import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBatchDto {
  @IsNotEmpty()
  @IsNumber()
  batchNumber: number;

  @IsNotEmpty()
  @IsNumber()
  createdByUserId: number;
}
