/**
 * Converte um valor formatado no padrão BR (ex.: "1.000.000,00", vindo do
 * MaskedInput variant="price") de volta pra number puro. parseFloat sozinho
 * não dá conta disso - ele para no segundo "." (inválido num float literal),
 * então "1.000.000,00" viraria só 1. Por isso removemos os separadores de
 * milhar antes, e só então trocamos a vírgula decimal por ponto.
 */
export function parseCurrency(value: string): number {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  return parseFloat(normalized) || 0;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(value: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "numeric"
  }).format(new Date(value));
}
