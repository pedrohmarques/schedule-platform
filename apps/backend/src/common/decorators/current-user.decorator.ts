import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import type { Role } from "../../modules/auth/jwt-payload.interface";

export interface CurrentUserPayload {
  id: string;
  email: string;
  role: Role;
  /** ClientProfile.id ou ProfessionalProfile.id, conforme o papel. */
  profileId: string;
}

/**
 * Extrai o usuário autenticado (populado pela JwtStrategy a partir do
 * token) direto do request — uso: create(@CurrentUser() user: CurrentUserPayload)
 *
 * Atenção: `id` é o User.id. Toda query sobre Job/JobRequest usa `profileId`.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest<Request & { user: CurrentUserPayload }>();
    return request.user;
  },
);
