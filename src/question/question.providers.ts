import { Connection } from 'mongoose';
import { QuestionSchema } from './model/question.schema';
import { consts } from 'src/consts';

export const questionProvider = [
  {
    provide: consts.QUESTION_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Question', QuestionSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
