import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema'; // Importation du modèle de base User

export type AdminDocument = Admin & Document;


@Schema({ timestamps: true })
export class Admin extends User {
  @Prop({ default: true })
  isSuperAdmin: boolean; // Peut gérer les enseignants et étudiants
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
