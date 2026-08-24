import { IsEmail, IsIn, IsString } from 'class-validator';
import type { Role } from '../jwt-payload.interface';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsIn(['client', 'professional'])
  role!: Role;
}