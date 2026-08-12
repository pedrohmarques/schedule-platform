'use client';

import { useEffect, useState } from 'react';
import { fetchAddressByCep, CepAddress } from '@/services/cep.service';

interface UseCepLookupResult {
  address: CepAddress | null;
  loading: boolean;
  error: string | null;
}
export function useCepLookup(zipCode: string): UseCepLookupResult {
  const [address, setAddress] = useState<CepAddress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const digits = zipCode.replace(/\D/g, '');

  useEffect(() => {
    if (digits.length !== 8) {
      setAddress(null);
      setError(null);
      return;
    }

    let cancelled = false;

    async function lookup() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchAddressByCep(digits);
        if (!cancelled) setAddress(result);
      } catch {
        if (!cancelled) {
          setAddress(null);
          setError('CEP não encontrado.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    lookup();

    return () => {
      cancelled = true;
    };
  }, [digits]);

  return { address, loading, error };
}
