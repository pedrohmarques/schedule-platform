import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export interface CurrentUserPayload {
  id: string;
  email: string;
}

/**
 * Extrai o usuário autenticado (populado pela JwtStrategy a partir do
 * token) direto do request — uso: create(@CurrentUser() user: CurrentUserPayload)
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest<Request & { user: CurrentUserPayload }>();
    return request.user;
  },
);
