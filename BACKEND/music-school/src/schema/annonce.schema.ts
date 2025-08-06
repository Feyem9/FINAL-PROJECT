import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Document } from "mongoose";

export type annonceDocument = HydratedDocument<Annonce>;

@Schema({ timestamps: true })
export class Annonce extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: ['event', 'training', 'sale'] })
  type: 'event' | 'training' | 'sale';

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  link: string;

  @Prop({ required: false })
  image?: string;

  @Prop({ required: false })
  location?: string;

  @Prop({ type: String, required: false })
  createdBy: string;
}

export const AnnonceSchema = SchemaFactory.createForClass(Annonce);