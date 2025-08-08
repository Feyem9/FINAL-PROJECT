import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema({ timestamps: true })
export class Note extends Document {
  @Prop({ required: true, minlength: 1, maxlength: 100 })
  title: string;

  @Prop({ required: true, maxlength: 1000 })
  content: string;

  // L'ID de l'utilisateur associé à la note
  @Prop({ type: String, required: true })
  authorId: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);