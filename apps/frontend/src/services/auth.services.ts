import { api } from '@/lib/api';
import type { Role, SessionUser } from '@/types/User';

interface LoginResponse {
  access_token: string;
  profile: SessionUser;
}

// loginClient e loginProf viram um só: o papel é um campo do body.
export function login(email: string, password: string, role: Role) {
  return api<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role }),
  });
}

export function postResetPassword(email: string, password: string) {
  return api<{ ok: true }>('/auth/reset', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}