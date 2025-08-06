import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class MusicResource extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: ['sheet_music', 'video', 'audio', 'article'] })
  type: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true, enum: ['beginner', 'intermediate', 'advanced'] })
  level: string;

  @Prop({ required: true })
  instrument: string;
}

export const MusicResourceSchema = SchemaFactory.createForClass(MusicResource);
