import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema'; // Importation du modèle de base User

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student extends User {  // 👈 Héritage du modèle User
  @Prop({ required: false, type: [String], default: [] })
  enrolledCourses: string[]; // Liste des IDs de cours suivis par l’étudiant

  @Prop({ required: true })
  instrument: string; // Instrument que l'étudiant veut apprendre (ex: "Piano", "Guitare")

  @Prop({ required: true })
  level: string; // Niveau de l’étudiant (ex: "Débutant", "Intermédiaire", "Avancé")

  @Prop({ type: [Object], default: [], required: false })
  assignments: any[]; // Liste des devoirs de l'étudiant

  @Prop({ type: [Object], default: [], required: false })
  quizzes: any[]; // Liste des quiz de l'étudiant

  @Prop({ type: [Object], default: [], required: false })
  upcomingTasks: any[]; // Liste des tâches à venir de l'étudiant
}


export const StudentSchema = SchemaFactory.createForClass(Student);
