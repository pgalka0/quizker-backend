import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export interface IQuestion {
  text: string;
  answers: string[];
  correctAnswer: string;
}

export class CreateQuestionDto implements IQuestion {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsArray()
  @IsNotEmpty()
  answers: string[];

  @IsString()
  @IsNotEmpty()
  correctAnswer: string;
}
