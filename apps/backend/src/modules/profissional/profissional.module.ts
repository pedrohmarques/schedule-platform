import { Module } from '@nestjs/common';
import { ProfissionalController } from './profissional.controller';
import { ProfissionalService } from './profissional.service';

@Module({
  controllers: [ProfissionalController],
  providers: [ProfissionalService],
})
export class ProfissionalModule {}