import { Injectable } from '@nestjs/common';
import { ServiceArea } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProfessionalService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * `id` aqui é o ProfessionalProfile.id — é ele que vai em
   * CreateJobDto.professionalId, não o User.id.
   */
  async findByArea(area?: ServiceArea) {
    const profiles = await this.prisma.professionalProfile.findMany({
      where: area ? { area } : undefined,
      select: {
        id: true,
        area: true,
        description: true,
        user: { select: { name: true, city: true, state: true } },
      },
      orderBy: { user: { name: 'asc' } },
      take: 50,
    });

    return profiles.map(({ user, ...profile }) => ({
      ...profile,
      name: user.name,
      city: user.city,
      state: user.state,
    }));
  }
}