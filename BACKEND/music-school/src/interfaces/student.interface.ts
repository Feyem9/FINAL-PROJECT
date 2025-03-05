
import { Document } from 'mongoose';
import { User } from './user.interface';

export interface Student extends User {
  readonly enrolleCourse: string[];
}
