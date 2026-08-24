import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload, Role } from './jwt-payload.interface';
import { SessionUserEntity } from './entities/session-user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string, role: Role) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { clientProfile: true, professionalProfile: true },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const profile =
      role === 'client' ? user.clientProfile : user.professionalProfile;

    if (!profile) {
      throw new UnauthorizedException(
        role === 'client'
          ? 'Essa conta não tem perfil de cliente.'
          : 'Essa conta não tem perfil de profissional.',
      );
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role,
      profileId: profile.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      profile: new SessionUserEntity({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role,
        profileId: profile.id,
        ...(user.professionalProfile && role === 'professional'
          ? {
              area: user.professionalProfile.area,
              description: user.professionalProfile.description,
            }
          : {}),
      }),
    };
  }

  async resetPassword(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('Email inválido');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: await bcrypt.hash(password, 10) },
    });

    return { ok: true };
  }
}