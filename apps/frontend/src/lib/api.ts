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

/**
 * Cliente HTTP fino para consumir a API do backend (NestJS).
 * Uso: await api<Usuario[]>('/users')
 */
export async function api<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
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
