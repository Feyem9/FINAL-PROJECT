import { Document } from 'mongoose';

export interface Course extends Document {
  readonly title: string;
  readonly description: string;
  readonly amount: number;
  readonly level: string;
  readonly media: 'video' | 'pdf' | 'audio';
  readonly teacher_id: string; // Assuming teacher_id is a reference to another document
  readonly createdAt: Date;
  readonly updatedAt: Date;
}