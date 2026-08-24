import { api } from '@/lib/api';
import type { Role, ServiceArea } from '@/types/User';

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;   // faltava nos tipos antigos — ia sem type-safety
  phone: string;
  birthDate: string;  // ISO date, "1994-03-27"
  cpf: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  role: Role;
  area?: ServiceArea;      // só profissional
  description?: string;    // só profissional
}

export function createUser(data: CreateUserPayload) {
  return api<{ id: string }>('/user', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}