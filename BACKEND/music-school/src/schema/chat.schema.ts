import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop()
  id: string;

  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  receiverId: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ required: false })
  readBy: String;

  @Prop({ default: false, required: false })
  edited: Boolean;

  @Prop({ required: false })
  editedAt: Date;

  @Prop({ required: false })
  deleted: Boolean;

  @Prop({ required: false })
  deletedAt: Date;

  @Prop({ required: false })
  replyTo: String; // ID du message auquel on répond

  @Prop({ required: false })
  reactions: [{
    userId: String,
    type: String, // emoji ou type de réaction
    createdAt: Date;
  }]

  @Prop({ required: false , type: Object })
  metadata: {
    fileSize: Number,
    mimeType: String,
    originalName: String
  }
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
