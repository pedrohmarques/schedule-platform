import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string, role: 'client' | 'profissional') {
    const account =
      role === 'client'
        ? await this.prisma.client.findUnique({ where: { email } })
        : await this.prisma.profissional.findUnique({ where: { email } });

    if (!account) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordMatches = await bcrypt.compare(password, account.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: account.id, email: account.email, role };

    return {
      access_token: this.jwtService.sign(payload),
      profile: account
    };
  }
}