import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateQuizDto } from './model/quiz.model';
import { QuizService } from './quiz.service';
import {
  Body,
  Controller,
  Get,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from './quiz.pipe';

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
    const { quizzes, pdf } = await this.quizService.generate(data);
    return quizzes;
  }

  @Post('/generate/class')
  @ApiOperation({ summary: 'Genereate Quiz for whole class' })
  async generateForClass(
    @Body() data: { className: string; questionsAmount: number; id: string },
  ) {
    return await this.quizService.generateForClass(data);
  }

  @Post('/submit')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: 'Submit Quiz' })
  async submitQuiz(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @Body() data: { quizId: string },
  ) {
    return await this.quizService.submit(files, data);
  }
}
