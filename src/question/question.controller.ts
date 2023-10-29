import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { CreateQuestionDto, IQuestion } from './model/question.model';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}
  @Post('/create')
  async create(@Body() data: CreateQuestionDto) {
    return await this.questionService.create(data);
  }

  @Get('')
  async getAll() {
    return await this.questionService.getAll();
  }

  @Post('/get')
  async getById(@Body() data: { ids: string[] }) {
    return await this.questionService.getByText(data.ids);
  }

  @Post('/delete')
  async delete(@Body() data: { ids: string[] }) {
    return await this.questionService.delete(data.ids);
  }
}
