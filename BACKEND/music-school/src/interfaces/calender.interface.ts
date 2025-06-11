import { Document } from 'mongoose';

export interface Calender extends Document {
  readonly title: string;
  readonly description: string;
  readonly start_date: Date;
  readonly end_date: Date;
  readonly audience: 'teacher' | 'student' | 'teacher_and_student';
  readonly creator?: string; // ID de l'utilisateur créateur (optionnel)
}
