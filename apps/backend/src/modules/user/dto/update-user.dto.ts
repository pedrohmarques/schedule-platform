import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// role e area saem: trocar de papel é criar perfil, não editar campo.
// description também: é coluna de ProfessionalProfile, não de User — editar
// a bio pede um PATCH /professional/me próprio.
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['role', 'area', 'description'] as const),
) {}