import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { CreateQuestionDto, IQuestion } from './model/question.model';
import { QuestionService } from './question.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Question')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('')
  @ApiOperation({ summary: 'Get all questions' })
  async getAll() {
    return await this.questionService.getAll();
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create question' })
  async create(@Body() data: CreateQuestionDto) {
    return await this.questionService.create(data);
  }

  @Post('/get')
  @ApiOperation({ summary: "Get question by ID's" })
  async getById(@Body() data: { ids: string[] }) {
    return await this.questionService.getById(data.ids);
  }

  @Post('/delete')
  async delete(@Body() data: { ids: string[] }) {
    return await this.questionService.delete(data.ids);
  }
}
