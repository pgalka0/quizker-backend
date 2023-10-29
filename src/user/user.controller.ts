import { Controller, Post, Get, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './model/user.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async create(@Body() data: CreateUserDto) {
    return await this.userService.create(data);
  }

  @Get('')
  async getAll() {
    return await this.userService.getAll();
  }
}
