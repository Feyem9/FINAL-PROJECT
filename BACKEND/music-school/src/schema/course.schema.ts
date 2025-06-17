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

  @Prop({ required: true, enum: ['piano', 'flute', 'violon', 'baterie'] })
  category: 'piano' | 'flute' | 'violon' | 'baterie';

  @Prop({ required: true, enum: ['beginner', 'intermediate', 'advanced'] })
  level: 'beginner' | 'intermediate' | 'advanced';

  @Prop({ required: true, enum: ['video', 'pdf', 'audio']})
  media: 'video' | 'pdf' | 'audio';

  @Prop({ required: true })
  teacher_id: string; // ID de l'enseignant créateur du cours

  @Prop()
  image?: string; // URL ou chemin de l'image (optionnel)

  @Prop()
  fileUrl?: string; // URL ou chemin du fichier média (optionnel)
}

export const courseSchema = SchemaFactory.createForClass(Course);