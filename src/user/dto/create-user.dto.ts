import { IsString, IsEmail, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  citizenId: string;

  @IsDateString()
  @IsNotEmpty()
  birthdate: Date;
}
