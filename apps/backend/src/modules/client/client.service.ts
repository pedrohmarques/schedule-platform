import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientService {
    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.client.findMany()
    }

    async findOne(id: string) {
        const client = await this.prisma.client.findUnique({ where: { id } });
        if(!client) {
            throw new NotFoundException(`Cliente ${id} não encontrado`)
        }

        return client;
    }

    async create(dto: CreateClientDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        return this.prisma.client.create({data: {...dto, password: hashedPassword }})
    }

    async update(id: string, dto: UpdateClientDto) {
        await this.findOne(id);
        return this.prisma.client.update({ where: { id }, data: dto });
      }
    
      async remove(id: string) {
        await this.findOne(id);
        return this.prisma.client.delete({ where: { id } });
      }
}