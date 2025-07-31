import { IsInt, IsBoolean, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBigbagDto {
  @IsNotEmpty()
  @IsNumber()
  batchId: number;

  @IsNotEmpty()
  @IsNumber()
  numberOfBatch: number;

  @IsBoolean()
  @IsOptional()
  question1?: boolean;

  @IsBoolean()
  @IsOptional()
  question2?: boolean;

  @IsBoolean()
  @IsOptional()
  question3?: boolean;

  @IsBoolean()
  @IsOptional()
  question4?: boolean;

  @IsBoolean()
  @IsOptional()
  question5?: boolean;

  @IsNotEmpty()
  @IsNumber()
  createdByUserId: number;
}
