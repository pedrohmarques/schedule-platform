import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/user')
  @HttpCode(HttpStatus.OK)
  @Public()
  userLogin(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password, "client");
  }

  @Post('login/prof')
  @HttpCode(HttpStatus.OK)
  @Public()
  proflogin(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password, "profissional");
  }
}