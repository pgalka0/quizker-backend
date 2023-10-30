import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Post,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { consts } from 'src/consts';
import { IClass } from './model/class.model';

@Injectable()
export class ClassService {
  constructor(@Inject(consts.CLASS_MODEL) private classModel: Model<IClass>) {}

  async create(data: IClass) {
    const exists = await this.classModel.exists({ name: data.name });
    if (exists) {
      throw new HttpException('Class already exists', HttpStatus.BAD_REQUEST);
    }

    return await this.classModel.create(data);
  }

  async getAll() {
    return this.classModel.find({});
  }

  async getByName(name: string) {
    return this.classModel.findOne({ name });
  }

  async addStudents(data: { name: string; students: string[] }) {
    const _class = await this.classModel.findOne({ name: data.name });

    if (!_class) {
      throw new HttpException('Class doesnt exists', HttpStatus.BAD_REQUEST);
    }

    const classStudents = _class.students;
    data.students.forEach(
      (id) => !classStudents.includes(id) && classStudents.push(id),
    );

    return await this.classModel.updateOne(
      { name: data.name },
      { students: classStudents },
    );
  }
}
