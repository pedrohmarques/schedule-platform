export type Role = 'client' | 'professional';

/**
 * Conteúdo do JWT. `sub` é o User.id; `profileId` é o id do ClientProfile
 * OU do ProfessionalProfile, conforme o papel escolhido no login.
 *
 * Os dois são cuid e o TypeScript não distingue um do outro — use sempre
 * `profileId` em queries sobre Job/JobRequest, nunca `sub`.
 */
export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  profileId: string;
}
