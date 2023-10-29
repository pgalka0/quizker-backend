import { CreateQuizDto } from './model/quiz.model';
import { QuizService } from './quiz.service';
import { Body, Controller, Get, Header, Post, Res } from '@nestjs/common';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('/create')
  async create(@Body() data: CreateQuizDto) {
    return await this.quizService.create(data);
  }

  @Get('')
  async getAll() {
    return await this.quizService.getAll();
  }

  @Post('/generate')
  @Header('Content-Type', 'application/pdf')
  async generate(
    @Res() res: Response,
    @Body() data: { students: string[]; questionsAmount: number; id: string },
  ) {
    const { quizzes, pdfs } = await this.quizService.generate(data);

    for (const pdf of pdfs) {
    }
  }
}
