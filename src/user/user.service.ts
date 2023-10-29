import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { consts } from 'src/consts';
import { IUser } from './model/user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject(consts.USER_MODEL)
    private userModel: Model<IUser>,
  ) {}

  async create(data: IUser) {
    const exists = await this.userModel.exists({ name: data.name });
    if (exists) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }
    return await this.userModel.create(data);
  }

  async getAll() {
    return this.userModel.find({});
  }
}
