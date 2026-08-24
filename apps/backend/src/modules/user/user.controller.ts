import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Public } from '../../common/decorators/public.decorator';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../../common/decorators/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  async create(@Body() dto: CreateUserDto) {
    return new UserEntity(await this.userService.create(dto));
  }

  @Get('me')
  async me(@CurrentUser() user: CurrentUserPayload) {
    return new UserEntity(await this.userService.findMe(user.id));
  }

  @Patch('me')
  async updateMe(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdateUserDto,
  ) {
    return new UserEntity(await this.userService.updateMe(user.id, dto));
  }
}
