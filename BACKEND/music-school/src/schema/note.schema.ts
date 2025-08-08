import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema({ timestamps: true })
export class Note extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  // L'ID de l'utilisateur associé à la note
  @Prop({ type: String, required: true })
  authorId: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);