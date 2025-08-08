export interface note extends Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}