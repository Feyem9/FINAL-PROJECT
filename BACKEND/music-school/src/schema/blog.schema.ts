import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Blog extends Document {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ default: '' })
    image: string;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ type: Types.ObjectId, ref: 'User', required: false })
    author: Types.ObjectId;

    @Prop({ type: [String], default: [] })
    categories: string[];

    @Prop({ default: false })
    published: boolean;

    @Prop({ default: null })
    publishedAt: Date;

    @Prop({ type: [{ user: { type: Types.ObjectId, ref: 'User' }, comment: String, createdAt: Date }], default: [] })
    comments: { user: Types.ObjectId; comment: string; createdAt: Date }[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);