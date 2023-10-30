import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
} from 'class-validator';

export interface IClass {
  name: string;
  students: string[];
}

export class CreateClassDto implements IClass {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  students: string[];
}
