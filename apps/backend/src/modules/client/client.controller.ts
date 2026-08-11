import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientEntity } from './entities/client.entity';
import { Public } from 'src/common/decorators/public.decorator';
  
  @Controller('client')
  export class ClientController {
    constructor(private readonly clientsService: ClientService) {}
  
    @Get()
    async findAll() {
      const clients = await this.clientsService.findAll();
      return clients.map(c => new ClientEntity(c))
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      const client = await this.clientsService.findOne(id);
      return new ClientEntity(client)
    }
  
    @Post()
    @Public()
    async create(@Body() dto: CreateClientDto) {
      const client = await this.clientsService.create(dto);
      return new ClientEntity(client)
    }
  
    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
      const client = await this.clientsService.update(id, dto);
      return new ClientEntity(client)
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string) {
      const client = await this.clientsService.remove(id);
      return new ClientEntity(client)
    }
  }