import cep from 'cep-promise';

export interface CepAddress {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

/**
 * Looks up an address from a CEP using cep-promise (which itself falls back
 * across multiple providers — BrasilAPI, ViaCEP, WideNet — if one fails).
 * Expects a full 8-digit CEP; formatting (dots/dashes) is stripped internally.
 */
export async function fetchAddressByCep(rawCep: string): Promise<CepAddress> {
  const digits = rawCep.replace(/\D/g, '');
  const result = await cep(digits);

  return {
    street: result.street,
    neighborhood: result.neighborhood,
    city: result.city,
    state: result.state,
  };
}
