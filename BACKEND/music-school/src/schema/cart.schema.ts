import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  // Tableau de cours dans le panier
  @Prop({
    type: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        courseName: { type: String, required: true },
        courseImage: { type: String, required: true },
        courseDescription: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true },
      }
    ],
    default: [],
  })
  courses: {
    courseId: string;
    courseName: string;
    courseImage: string;
    courseDescription: string;
    quantity: number;
    price: number;
  }[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
