import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export enum PaymentMethod {
  MTNMOMO = 'CM_MTNMOMO',
  ORANGE = 'CM_ORANGE',
  CARD = 'CARD',
  BANK = 'BANK'
}


@Schema()
export class TransactionItem {
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

@Schema()
export class PaymentDetails {
  @Prop()
  cardLastFour?: string;

  @Prop()
  paypalEmail?: string;

  @Prop()
  bankReference?: string;
}

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: [TransactionItem], required: true })
  items: TransactionItem[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ 
    required: true, 
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  })
  status: string;

  @Prop({ 
    required: true, 
    enum: ['card', 'paypal', 'bank_transfer'] 
  })
  paymentMethod: string;

  @Prop({ type: PaymentDetails })
  paymentDetails?: PaymentDetails;

  @Prop({ required: true, unique: true })
  transactionId: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);