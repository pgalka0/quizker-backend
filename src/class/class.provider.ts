import { Connection } from 'mongoose';
import { consts } from 'src/consts';
import { ClassSchema } from './model/class.schema';

export const classProvider = [
  {
    provide: consts.CLASS_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Class', ClassSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
