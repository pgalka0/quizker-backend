import { UserService } from './../user/user.service';
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
import { generate } from '@pdfme/generator';
import * as fs from 'fs';
import * as path from 'path';
import { ClassService } from 'src/class/class.service';
const PDFMerger = require('pdf-merger-js');
const FormData = require('form-data');
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { QuestionService } from 'src/question/question.service';

@Injectable()
export class QuizService {
  constructor(
    @Inject(consts.QUIZ_MODEL)
    private quizModel: Model<IQuiz>,
    private readonly classService: ClassService,
    private readonly questionService: QuestionService,
    private readonly userService: UserService,
  ) {}

  async create(data: IQuiz) {
    const exists = await this.quizModel.exists({ name: data.name });
    if (exists) {
      throw new HttpException('Quiz already exists', HttpStatus.BAD_REQUEST);
    }
    return await this.quizModel.create(data);
  }

  async getAll() {
    return { quizzes: await this.quizModel.find({}) };
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

    const instances = [];

    for (const studentId of data.students) {
      const randomNumber = getRandomInt(
        quizQuestions.length - data.questionsAmount,
      );
      const studentQuestions = quizQuestions
        .slice(randomNumber, randomNumber + data.questionsAmount)
        .sort(() => Math.random() - 0.5);

      const quizInstance: IQuizInstance = {
        name: quiz.name,
        questions: studentQuestions,
        student: studentId,
      };
      quizzes.push(quizInstance);

      const student = await this.userService.getById(studentId);
      if (!student) {
        throw new HttpException('Student not found', HttpStatus.BAD_REQUEST);
      }

      const quizInstanceId = uuidv4();
      const pdfData = {
        student: studentId,
        id: quizInstanceId,
        name: student.name,
      };

      const pdf = await this.generatePDF(pdfData, timestamp.toString());
      pdfs.push(pdf);

      instances.push({ id: quizInstanceId, questions: studentQuestions });
    }

    const resPdf = await this.mergePdfs(pdfs, timestamp.toString());

    await this.quizModel.updateOne(
      { id: data.id },
      { $push: { instances: { $each: instances } } },
    );

    return { quizzes, pdf: 'http://localhost:3069/' + resPdf };
  }

  async generatePDF(
    data: { id: string; student: string; name: string },
    timestamp: string,
  ) {
    const template = {
      ...PDF_TEMPLATE,
    };
    const inputs = [
      {
        data: JSON.stringify(data),
        username: data.name,
      },
    ];

    const pdf = await generate({ template: template as any, inputs });

    const filePath = `../../pdfs/${data.name}-${timestamp}.pdf`;
    fs.writeFileSync(path.join(__dirname, filePath), pdf);

    return path.join(__dirname, filePath);
  }

  async mergePdfs(pdfs: string[], timestamp: string) {
    var merger = new PDFMerger();

    for (const pdf of pdfs) {
      await merger.add(pdf);
    }
    const filePath = `../../pdfs/result-${timestamp}.pdf`;
    await merger.save(path.join(__dirname, filePath));

    return `result-${timestamp}.pdf`;
  }

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

  async submit(files: Express.Multer.File[], data: { quizId: string }) {
    const quiz = await this.quizModel.findOne({ id: data.quizId });
    if (!quiz) {
      console.log('Quiz not found');
      throw new HttpException('Quiz not found', HttpStatus.BAD_REQUEST);
    }

    const form = new FormData();
    for (const file of files) {
      form.append('files', file.buffer, file.originalname);
    }
    const response = await axios.post(
      `http://127.0.0.1:5069/upload_test`,
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
      },
    );

    const returnObj = {
      results: [],
    };

    const { results } = response.data;
    for (const resp of results) {
      // {
      //   result: { q4: 'E', q1: 'B', q2: 'A', q3: 'A', q5: 'B' },
      //   data: {
      //     student: '4d8c586a-ff60-4e7c-976e-0c1b8e2b93ee',
      //     id: 'b11e462e-b490-41ac-94af-c74be848430b',
      //     name: 'Kamil'
      //   }
      // }
      const quizData = resp.data;
      const { id, name, student } = quizData;

      const instance = quiz.instances.filter(
        (instance) => instance.id === id,
      )[0];

      const answers = Object.keys(resp.result)
        .sort()
        .map((k) => resp.result[k]);

      const questions = await this.questionService.getById(instance.questions);
      const totalPoints = questions.length;
      let userPoints = 0;
      let idx = 0;
      questions.forEach((question) => {
        const correctAnswer = this.getCorrectAnswer(question);
        if (correctAnswer === answers[idx]) {
          userPoints++;
        }
        idx++;
      });

      const res = {
        result: resp.result,
        name: name,
        score: ((userPoints / totalPoints) * 100).toString() + '%',
      };

      returnObj.results.push(res);
    }

    return returnObj;
  }

  private getCorrectAnswer(question: any) {
    const correctAnswer = question.answers.indexOf(question.correctAnswer);
    let correctAnswerLetter = '0';
    switch (correctAnswer) {
      case 0:
        correctAnswerLetter = 'A';
        break;
      case 1:
        correctAnswerLetter = 'B';
        break;
      case 2:
        correctAnswerLetter = 'C';
        break;
      case 3:
        correctAnswerLetter = 'D';
        break;
      case 4:
        correctAnswerLetter = 'E';
        break;
    }

    return correctAnswerLetter;
  }
}
