import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ServiceArea } from '@prisma/client';
import type { Role } from '../../auth/jwt-payload.interface';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  phone!: string;

  @Type(() => Date)
  @IsDate()
  birthDate!: Date;

  @IsString()
  cpf!: string;

  @IsString()
  zipCode!: string;

  @IsString()
  street!: string;

  @IsString()
  number!: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsString()
  neighborhood!: string;

  @IsString()
  city!: string;

  @IsString()
  state!: string;

  @IsIn(['client', 'professional'])
  role!: Role;

  // Só exigido quando role === 'professional'.
  @ValidateIf((o: CreateUserDto) => o.role === 'professional')
  @IsEnum(ServiceArea)
  area?: ServiceArea;

  @IsOptional()
  @IsString()
  description?: string;
}