import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { CreateProfissionalDto } from "./dto/create-profissional.dto";
import { UpdateProfissionalDto } from "./dto/update-profissional.dto";

@Injectable()
export class ProfissionalService {
    constructor(private readonly prisma: PrismaService) {}

    findAll(area?: string ) {
        return this.prisma.profissional.findMany({
            where: area ? { area: {contains: area, mode: 'insensitive' } } : undefined
        })
    }

    async findOne(id: string) {
        const profissional = await this.prisma.profissional.findUnique({ where: { id } });
        if(!profissional) {
            throw new NotFoundException(`Profissional ${id} não encontrado`)
        }

        return profissional;
    }

    async create(dto: CreateProfissionalDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        return this.prisma.profissional.create({data: {...dto, password: hashedPassword }})
    }

    async update(id: string, dto: UpdateProfissionalDto) {
        await this.findOne(id);
        return this.prisma.profissional.update({ where: { id }, data: dto });
    }
    
    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.profissional.delete({ where: { id } });
    }
}