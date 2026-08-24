import { ServiceArea } from '@prisma/client';
import type { Role } from '../jwt-payload.interface';

/**
 * O que o frontend guarda no sessionStorage depois do login.
 * Montado campo a campo de propósito: nada de senha escapa por acidente.
 */
export class SessionUserEntity {
  id!: string;
  name!: string;
  email!: string;
  phone!: string;
  role!: Role;
  profileId!: string;
  area?: ServiceArea;
  description?: string | null;

  constructor(partial: Partial<SessionUserEntity>) {
    Object.assign(this, partial);
  }
}