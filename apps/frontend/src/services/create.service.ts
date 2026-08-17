import { api } from '@/lib/api';
import { Client } from '@/types/Client';
import { Professional } from '@/types/Professional';

interface ProfessionalData {
    name: string;
    email: string;
    phone: string;
    age: number;
    area: string;
    description: string;
    cpf: string;
    zipCode: string;
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
}

interface ClientData {
    name: string;
    email: string;
    phone: string;
    age: number;
    cpf: string;
    zipCode: string;
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
}

export function createClient(cliData: ClientData) {
  return api<Client>('/client', {
    method: 'POST',
    body: JSON.stringify(cliData),
  });
}

export function createProf(proData: ProfessionalData) {
  return api<Professional>('/professional', {
    method: 'POST',
    body: JSON.stringify(proData),
  });
}