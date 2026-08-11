// src/modules/client/entities/client.entity.ts
import { Exclude } from 'class-transformer';

export class ProfissionalEntity {
  id!: string;
  name!: string;
  email!: string;

  @Exclude()
  password!: string;

  phone!: string;
  age!: number;
  cpf!: string;
  area!: string;
  description!: string | null;
  zipCode!: string;
  street!: string;
  number!: string;
  complement!: string | null;
  neighborhood!: string;
  city!: string;
  state!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<ProfissionalEntity>) {
    Object.assign(this, partial);
  }
}