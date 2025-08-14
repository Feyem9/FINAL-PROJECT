
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Document } from 'mongoose';



export type userDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: [true, 'dupllicate email entered'], required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  contact: string;

  @Prop({ required: false })
  image?: string;

  @Prop({ required: true, enum: ['admin', 'teacher', 'student'] })
  role: 'admin' | 'teacher' | 'student';
}

export const userSchema = SchemaFactory.createForClass(User);