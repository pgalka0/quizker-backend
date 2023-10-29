import { Connection } from 'mongoose';
import { consts } from 'src/consts';
import { UserSchema } from './model/user.schema';

export const userProvider = [
  {
    provide: consts.USER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
