import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { CurrentUserPayload } from '../decorators/current-user.decorator';
import type { Role } from '../../modules/auth/jwt-payload.interface';

/**
 * Roda depois do JwtAuthGuard, que é quem popula request.user.
 * Rota sem @Roles() não restringe papel — só exige estar autenticado.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required?.length) return true;

    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: CurrentUserPayload }>();

    if (!user || !required.includes(user.role)) {
      throw new ForbiddenException('Seu perfil não tem acesso a esse recurso.');
    }

    return true;
  }
}
