
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Document } from 'mongoose';


export type courseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course extends Document{
  @Prop({required:true})
  title: string;

  @Prop({required:true})
  description: string;

  @Prop({required:true})
  amount: number;

  @Prop({required:true})
  level: string;

  @Prop({ required:true , enum: ['video', 'pdf', 'audio']})
  media: 'video' | 'pdf' | 'audio';

  @Prop()
  teacher_id: string; // Assuming teacher_id is a reference to another document

  @Prop()
  image: string; // Assuming image is a URL or path to the image
}

export const courseSchema = SchemaFactory.createForClass(Course);