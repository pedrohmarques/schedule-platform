const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null; // SSR guard - sem cookie no servidor
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Cliente HTTP fino para consumir a API do backend (NestJS).
 * Anexa automaticamente o token JWT (do cookie) como Authorization header,
 * quando existir. Uso: await api<Usuario[]>('/users')
 */
export async function api<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = getTokenFromCookie();

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as { message?: string });
    throw new ApiError(
      res.status,
      body.message ?? `Erro ao chamar ${path} (${res.status})`,
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
