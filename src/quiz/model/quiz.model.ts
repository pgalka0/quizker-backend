import {
  IsAlpha,
  IsArray,
  IsEmpty,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export interface IQuiz {
  name: string;
  questions: string[];
  instances: {
    id: string;
    questions: string[];
  }[];
}

export interface IQuizInstance {
  name: string;
  questions: string[];
  student: string;
}

export class CreateQuizDto implements IQuiz {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsNotEmpty()
  questions: string[];

  instances: { id: string; questions: string[] }[];
}
