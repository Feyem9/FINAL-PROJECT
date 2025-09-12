import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
  courseId: string;

  @Prop({ type: String, required: true })
  courseName: string;

  @Prop({ type: String, required: true })
  courseImage: string;

  @Prop({ type: String, required: true })
  courseDescription: string;

  @Prop({ type: Number, required: true, default: 1 })
  quantity: number;

  @Prop({ type: Number, required: true })
  price: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
