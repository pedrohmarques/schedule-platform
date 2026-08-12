import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ClientEntity } from '../client/entities/client.entity';
import { ProfissionalEntity } from '../profissional/entities/profissional.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/user')
  @HttpCode(HttpStatus.OK)
  @Public()
  async userLogin(@Body() dto: LoginDto) {
    const user = await this.authService.login(dto.email, dto.password, "client");
    return { ...user, profile: new ClientEntity(user.profile) };
  }

  @Post('login/prof')
  @HttpCode(HttpStatus.OK)
  @Public()
  async proflogin(@Body() dto: LoginDto) {
    const user = await this.authService.login(dto.email, dto.password, "profissional");
    return { ...user, profile: new ProfissionalEntity(user.profile) };
  }
}
