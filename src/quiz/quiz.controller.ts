import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateQuizDto } from './model/quiz.model';
import { QuizService } from './quiz.service';
import { Body, Controller, Get, Header, Post, Res } from '@nestjs/common';

@ApiTags('Quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('')
  @ApiOperation({ summary: 'Get all Quizzez' })
  async getAll() {
    return await this.quizService.getAll();
  }

  @Post('/create')
  @ApiOperation({ summary: 'Crate quiz instance' })
  async create(@Body() data: CreateQuizDto) {
    return await this.quizService.create(data);
  }

  @Post('/generate')
  @ApiOperation({ summary: 'Generate Quiz for students' })
  async generate(
    @Body() data: { students: string[]; questionsAmount: number; id: string },
  ) {
    const { quizzes } = await this.quizService.generate(data);
    return quizzes;
  }

  @Post('/generate/class')
  @ApiOperation({ summary: 'Genereate Quiz for whole class' })
  async generateForClass(
    @Body() data: { className: string; questionsAmount: number; id: string },
  ) {
    return await this.quizService.generateForClass(data);
  }
}
