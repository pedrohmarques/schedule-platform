import { api } from '@/lib/api';
import { Client } from '@/types/Client';
import { Professional } from '@/types/Professional';

interface LoginResponse {
  access_token: string;
  profile: Client | Professional
}

export function loginClient(email: string, password: string) {
  return api<LoginResponse>('/auth/login/user', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function loginProf(email: string, password: string) {
  return api<LoginResponse>('/auth/login/prof', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function postResetPassword(email: string, password: string, role: 'client' | 'professional') {
  return api<LoginResponse>('/auth/reset', {
    method: 'POST',
    body: JSON.stringify({ email, password, role }),
  });
}