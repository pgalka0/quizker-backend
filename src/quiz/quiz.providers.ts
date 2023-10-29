import { Connection } from 'mongoose';
import { QuizSchema } from './model/quiz.schema';
import { consts } from 'src/consts';

export const quizProvider = [
  {
    provide: consts.QUIZ_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Quiz', QuizSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
