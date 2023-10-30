import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Class>;

@Schema()
export class Class {
  @Prop()
  name: string;

  @Prop()
  students: string[];
}

export const ClassSchema = SchemaFactory.createForClass(Class);
