import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const { role, area, description, password, ...userData } = dto;

    // O perfil nasce junto com o usuário, no mesmo nested create — nunca
    // existe User sem perfil nenhum.
    return this.prisma.user.create({
      data: {
        ...userData,
        password: await bcrypt.hash(password, 10),
        ...(role === 'client'
          ? { clientProfile: { create: {} } }
          : { professionalProfile: { create: { area: area!, description } } }),
      },
    });
  }

  async findMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { clientProfile: true, professionalProfile: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  // O id vem do token, nunca da URL — é isso que fecha o IDOR que existia
  // no antigo PATCH /client/:id.
  async updateMe(userId: string, dto: UpdateUserDto) {
    const { password, ...rest } = dto;

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...rest,
        ...(password ? { password: await bcrypt.hash(password, 10) } : {}),
      },
    });
  }
}
