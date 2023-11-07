import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsSemVer,
  IsString,
} from 'class-validator';

export interface IUser {
  name: string;
  class: string;
}

export class CreateUserDto implements IUser {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmpty()
  class: string;
}
