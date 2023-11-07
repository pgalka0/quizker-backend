import {
  Injectable,
  Inject,
  HttpException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { consts } from 'src/consts';
import { IQuestion } from './model/question.model';

@Injectable()
export class QuestionService {
  constructor(
    @Inject(consts.QUESTION_MODEL)
    private questionModel: Model<IQuestion>,
  ) {}

  async create(data: IQuestion) {
    const exists = await this.questionModel.exists({ text: data.text });
    if (exists) {
      throw new HttpException(
        'Question already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.questionModel.create(data);
  }

  async getAll() {
    return await this.questionModel.find({});
  }

  async getById(data?: string[]) {
    return await this.questionModel.find(
      data?.length
        ? {
            id: {
              $in: [...data],
            },
          }
        : {},
    );
  }

  async delete(data?: string[]) {
    if (data?.length === 0) {
      throw new HttpException(
        'Please provide question text',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.questionModel.deleteMany({ id: { $in: [...data] } });
  }
}
