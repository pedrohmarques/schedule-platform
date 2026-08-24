export type Role = 'client' | 'professional';

export type ServiceArea =
  | 'BARBEARIA'
  | 'CABELEIREIRO'
  | 'MANICURE_PEDICURE'
  | 'ESTETICA_FACIAL'
  | 'ESTETICA_CORPORAL'
  | 'DEPILACAO'
  | 'MAQUIAGEM'
  | 'DESIGN_SOBRANCELHAS'
  | 'MASSOTERAPIA'
  | 'FISIOTERAPIA'
  | 'PERSONAL_TRAINER'
  | 'NUTRICAO'
  | 'PSICOLOGIA'
  | 'ODONTOLOGIA'
  | 'PODOLOGIA'
  | 'TATUAGEM';

/** O que fica no sessionStorage depois do login. */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  profileId: string;
  area?: ServiceArea;
  description?: string | null;
}

/** Item da listagem de profissionais — id é o ProfessionalProfile.id. */
export interface ProfessionalListItem {
  id: string;
  area: ServiceArea;
  description: string | null;
  name: string;
  city: string;
  state: string;
}