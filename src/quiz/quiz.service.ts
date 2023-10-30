import { PDF_TEMPLATE } from './../pdfTemplate';
import { QuizModule } from './quiz.module';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { consts } from 'src/consts';
import { IQuiz, IQuizInstance } from './model/quiz.model';
import { getRandomInt } from 'src/utils';
import { Template, generate } from '@pdfme/generator';
import * as fs from 'fs';
import * as path from 'path';
import { ClassService } from 'src/class/class.service';
const merge = require('easy-pdf-merge');

@Injectable()
export class QuizService {
  constructor(
    @Inject(consts.QUIZ_MODEL)
    private quizModel: Model<IQuiz>,
    private readonly classService: ClassService,
  ) {}

  async create(data: IQuiz) {
    const exists = await this.quizModel.exists({ name: data.name });
    if (exists) {
      throw new HttpException('Quiz already exists', HttpStatus.BAD_REQUEST);
    }
    return await this.quizModel.create(data);
  }

  async getAll() {
    return this.quizModel.find({});
  }

  async generate(data: {
    students: string[];
    questionsAmount: number;
    id: string;
  }) {
    const quiz = await this.quizModel.findOne({ id: data.id });

    if (!quiz) {
      throw new HttpException('Quiz doesnt exists', HttpStatus.BAD_REQUEST);
    }

    const quizzes: Array<IQuizInstance> = [];
    const quizQuestions = quiz.questions;

    const pdfs = [];
    const timestamp = Date.now();

    for (const student of data.students) {
      const randomNumber = getRandomInt(
        quizQuestions.length - data.questionsAmount,
      );
      const studentQuestions = quizQuestions
        .slice(randomNumber, randomNumber + data.questionsAmount)
        .sort(() => Math.random() - 0.5);

      const quizInstance: IQuizInstance = {
        name: quiz.name,
        questions: studentQuestions,
        student: student,
      };
      quizzes.push(quizInstance);

      const pdf = await this.generatePDF(student, timestamp.toString());
      pdfs.push(pdf);
    }

    // await this.mergePdfs(pdfs, timestamp.toString());

    return { quizzes };
  }

  async generatePDF(username: string, timestamp: string) {
    const template = {
      ...PDF_TEMPLATE,
    };
    const inputs = [
      {
        owner: username,
      },
    ];

    const pdf = await generate({ template: template as any, inputs });

    const filePath = `../../pdfs/${username}-${timestamp}.pdf`;
    fs.writeFileSync(path.join(__dirname, filePath), pdf);

    return path.join(__dirname, filePath);
  }

  // async mergePdfs(pdfs: string[], timestamp: string) {
  //   merge(
  //     pdfs,
  //     path.join(__dirname, `../../pdfs/result-${timestamp}.pdf`),
  //     function (err) {
  //       if (err) {
  //         return console.log(err);
  //       }
  //       console.log('Success');
  //     },
  //   );
  // }

  async generateForClass(data: {
    className: string;
    questionsAmount: number;
    id: string;
  }) {
    const students = (await this.classService.getByName(data.className))
      .students;

    if (students.length > 0) {
      return await this.generate({
        students,
        questionsAmount: data.questionsAmount,
        id: data.id,
      });
    } else {
      throw new HttpException('No students available', HttpStatus.BAD_REQUEST);
    }
  }
}
