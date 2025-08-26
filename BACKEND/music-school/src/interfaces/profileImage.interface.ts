import { Document } from 'mongoose';

export interface IProfileImage extends Document {
   _id: string;
  userId: string;
  userType: 'admin' | 'teacher' | 'student';
  imageUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  updatedAt?: Date;
}