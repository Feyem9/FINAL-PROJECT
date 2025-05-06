import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema'; // Importation du modèle de base User

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student extends User {  // 👈 Héritage du modèle User
  @Prop({ required: false  , type: [String], default: []})
  enrolledCourses: string[]; // Liste des IDs de cours suivis par l’étudiant

  @Prop({ required: true })
  instrument: string; // Instrument que l'étudiant veut apprendre (ex: "Piano", "Guitare")

  @Prop({ required: true })
  level: string; // Niveau de l’étudiant (ex: "Débutant", "Intermédiaire", "Avancé")
}


export const StudentSchema = SchemaFactory.createForClass(Student);
