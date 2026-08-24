import { Controller, Get, Query } from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { FindProfessionalQueryDto } from './dto/find-professional.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('professional')
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}

  // Quem lista profissionais é o cliente, no modal de solicitar serviço.
  @Get()
  @Roles('client')
  findAll(@Query() query: FindProfessionalQueryDto) {
    return this.professionalService.findByArea(query.area);
  }
}
