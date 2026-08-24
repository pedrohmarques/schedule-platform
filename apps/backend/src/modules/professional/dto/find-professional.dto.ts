import { IsEnum, IsOptional } from 'class-validator';
import { ServiceArea } from '@prisma/client';

export class FindProfessionalQueryDto {
  @IsOptional()
  @IsEnum(ServiceArea)
  area?: ServiceArea;
}