
import { Document } from 'mongoose';
import { User } from './user.interface';

export interface Teacher extends User {
  readonly speciality: string;
  readonly courses: string[];
}
