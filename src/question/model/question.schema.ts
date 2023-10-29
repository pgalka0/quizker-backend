import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  })
  id: string;

  @Prop()
  text: string;

  @Prop()
  answers: string[];

  @Prop()
  correctAnswer: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
