// src/modules/auth/dto/login.dto.ts
import { IsEmail, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  role!: "client" | "professional"
}