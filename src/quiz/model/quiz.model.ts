import { IsAlpha, IsArray, IsNotEmpty, IsString } from 'class-validator';

export interface IQuiz {
  name: string;
  questions: string[];
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
}
