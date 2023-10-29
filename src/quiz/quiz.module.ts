import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { quizProvider } from './quiz.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [QuizController],
  providers: [QuizService, ...quizProvider],
})
export class QuizModule {}
