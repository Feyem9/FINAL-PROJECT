import { Document } from 'mongoose';

export interface Course extends Document {
  readonly title: string;
  readonly description: string;
  readonly amount: number;
  readonly category: 'piano' | 'flute' | 'violon' | 'baterie';
  readonly level: 'beginner' | 'intermediate' | 'advanced';
  readonly media: 'video' | 'pdf' | 'audio';
  readonly teacher_id: string;
  readonly image?: string;
  readonly fileUrl?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}