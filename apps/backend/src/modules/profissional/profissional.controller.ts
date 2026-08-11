import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { ProfissionalService } from './profissional.service';
import { ProfissionalEntity } from './entities/profissional.entity';
import { CreateProfissionalDto } from './dto/create-profissional.dto';
import { UpdateProfissionalDto } from './dto/update-profissional.dto';
  
  @Controller('profissional')
  export class ProfissionalController {
    constructor(private readonly profissionalService: ProfissionalService) {}
  
    @Get()
    async findAll() {
      const profissionals = await this.profissionalService.findAll();
      return profissionals.map(c => new ProfissionalEntity(c))
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      const profissional = await this.profissionalService.findOne(id);
      return new ProfissionalEntity(profissional)
    }
  
    @Post()
    @Public()
    async create(@Body() dto: CreateProfissionalDto) {
      const profissional = await this.profissionalService.create(dto);
      return new ProfissionalEntity(profissional)
    }
  
    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateProfissionalDto) {
      const profissional = await this.profissionalService.update(id, dto);
      return new ProfissionalEntity(profissional)
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string) {
      const profissional = await this.profissionalService.remove(id);
      return new ProfissionalEntity(profissional)
    }
  }