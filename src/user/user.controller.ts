import { Controller, Post, Get, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './model/user.model';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @ApiOperation({ summary: 'Get all users' })
  async getAll() {
    return await this.userService.getAll();
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() data: CreateUserDto) {
    return await this.userService.create(data);
  }
}
