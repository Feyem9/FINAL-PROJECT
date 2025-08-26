import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfileImageDocument = ProfileImage & Document;

@Schema()
export class ProfileImage {
  @Prop({ required: true, unique: true , index: true,type: String })
  userId: string;

  @Prop({ required: true })
  userType: 'admin' | 'teacher' | 'student';

  @Prop({ required: true, type: String })
  imageUrl: string;

  @Prop({ default: Date.now })
  uploadedAt: Date;

  @Prop()
  fileName: string;

  @Prop()
  fileSize: number;

  @Prop()
  mimeType: string;
}

export const ProfileImageSchema = SchemaFactory.createForClass(ProfileImage);