import {
    IsEmail,
    IsInt,
    IsOptional,
    IsString,
    Min,
    MinLength,
  } from 'class-validator';
  
  export class CreateProfissionalDto {
    @IsString()
    name!: string;
  
    @IsEmail()
    email!: string;
  
    @IsString()
    @MinLength(6)
    password!: string;
  
    @IsString()
    phone!: string;
  
    @IsInt()
    @Min(0)
    age!: number;
  
    @IsString()
    cpf!: string;

    @IsString()
    area!: string;

    @IsString()
    @IsOptional()
    description!: string;
  
    // Endereço
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
  }