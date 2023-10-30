import { ClassService } from './class.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiDefaultResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateClassDto } from './model/class.model';
import { appendFileSync } from 'fs';

@ApiTags('Class')
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('')
  @ApiOperation({ summary: 'Get all classes' })
  async getAll() {
    return await this.classService.getAll();
  }

  @Get('/:name')
  @ApiOperation({ summary: 'Get class by name' })
  async getByName(@Param('name') name: string) {
    return this.classService.getByName(name);
  }

  @Post('/create')
  @ApiOperation({ summary: 'Crate class' })
  async create(@Body() data: CreateClassDto) {
    return await this.classService.create(data);
  }

  @Post('/addStudents')
  @ApiOperation({ summary: 'Add students' })
  async addStudent(@Body() data: { name: string; students: string[] }) {
    return await this.classService.addStudents(data);
  }
}
