import cep from 'cep-promise';

export interface CepAddress {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

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
