import { IsNotEmpty, IsNumber, IsArray, ValidateNested, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class CreateBigbagDto {
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
}

export class CreateBatchDto {
  @IsNotEmpty()
  @IsNumber()
  batchNumber: number;

  @IsNotEmpty()
  @IsNumber()
  createdByUserId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBigbagDto)
  bigbags: CreateBigbagDto[];
}
