// src/modules/client/entities/client.entity.ts
import { Exclude } from 'class-transformer';

export class ClientEntity {
  id!: string;
  name!: string;
  email!: string;

  @Exclude()
  password!: string;

  phone!: string;
  age!: number;
  cpf!: string;
  zipCode!: string;
  street!: string;
  number!: string;
  complement!: string | null;
  neighborhood!: string;
  city!: string;
  state!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<ClientEntity>) {
    Object.assign(this, partial);
  }
}