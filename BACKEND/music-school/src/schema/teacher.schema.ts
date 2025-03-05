import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema'; // Importation du modèle de base User

export type TeacherDocument = Teacher & Document;

@Schema({ timestamps: true })
export class Teacher extends User {  // 👈 Héritage du modèle User
  @Prop({ required: true })
  speciality: string; // 📌 Matière enseignée (ex: "Piano", "Guitare", "Solfège")

  @Prop({ type: [String], default: [] })
  courses: string[]; // 📌 Liste des IDs des cours créés par l’enseignant
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
