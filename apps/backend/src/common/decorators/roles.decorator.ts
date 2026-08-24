import { SetMetadata } from '@nestjs/common';
import type { Role } from '../../modules/auth/jwt-payload.interface';

export const ROLES_KEY = 'roles';

/** Restringe a rota aos papéis informados — ver RolesGuard. */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
