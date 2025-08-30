import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';

export type CartDocument = HydratedDocument<Cart>;


@Schema({ timestamps: true })
export class Cart extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
    userId: User;

    @Prop({ required: true })
    courseId: string;

    @Prop({ required: true })
    courseName: string;

    @Prop({ required: true })
    courseImage: string;

    @Prop({ required: true })
    courseDescription: string;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    price: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
