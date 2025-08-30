import { Document } from "mongodb";

export interface Cart extends Document {
  courseId: string;
  courseName: string;
  courseImage: string;
  courseDescription: string;
  quantity: number;
  price: number;
}
