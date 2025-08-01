import { IsInt, IsBoolean, IsOptional, IsNotEmpty, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SingleBigbagDto {
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

export class CreateBigbagDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleBigbagDto)
  bigbags: SingleBigbagDto[];
}
