import { Exclude } from 'class-transformer';

export class UserEntity {
  id!: string;
  name!: string;
  email!: string;

  @Exclude()
  password!: string;

  phone!: string;
  birthDate!: Date;
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

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}