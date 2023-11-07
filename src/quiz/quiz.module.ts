import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { quizProvider } from './quiz.providers';
import { DatabaseModule } from 'src/database/database.module';
import { ClassModule } from 'src/class/class.module';
import { QuestionModule } from 'src/question/question.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [DatabaseModule, ClassModule, QuestionModule, UserModule],
  controllers: [QuizController],
  providers: [QuizService, ...quizProvider],
})
export class QuizModule {}
