import type { ServiceArea } from '@/types/User';

// Os `value` precisam ser exatamente os membros do enum ServiceArea do
// Prisma — é isso que faz o filtro por área casar.
export const SERVICE_AREAS: { label: string; value: ServiceArea }[] = [
  { label: 'Barbearia', value: 'BARBEARIA' },
  { label: 'Cabeleireiro(a)', value: 'CABELEIREIRO' },
  { label: 'Manicure e Pedicure', value: 'MANICURE_PEDICURE' },
  { label: 'Estética Facial', value: 'ESTETICA_FACIAL' },
  { label: 'Estética Corporal', value: 'ESTETICA_CORPORAL' },
  { label: 'Depilação', value: 'DEPILACAO' },
  { label: 'Maquiagem', value: 'MAQUIAGEM' },
  { label: 'Design de Sobrancelhas', value: 'DESIGN_SOBRANCELHAS' },
  { label: 'Massoterapia', value: 'MASSOTERAPIA' },
  { label: 'Fisioterapia', value: 'FISIOTERAPIA' },
  { label: 'Personal Trainer', value: 'PERSONAL_TRAINER' },
  { label: 'Nutrição', value: 'NUTRICAO' },
  { label: 'Psicologia', value: 'PSICOLOGIA' },
  { label: 'Odontologia', value: 'ODONTOLOGIA' },
  { label: 'Podologia', value: 'PODOLOGIA' },
  { label: 'Tatuagem', value: 'TATUAGEM' },
];