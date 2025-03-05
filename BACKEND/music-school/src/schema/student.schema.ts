import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema'; // Importation du modèle de base User

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student extends User {  // 👈 Héritage du modèle User
  @Prop({ required: true  , type: [String], default: []})
  enrolledCourses: string[]; // Liste des IDs de cours suivis par l’étudiant
}


export const StudentSchema = SchemaFactory.createForClass(Student);
