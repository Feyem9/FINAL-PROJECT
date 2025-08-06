import { Types } from 'mongoose';

export interface Blog {
    _id?: Types.ObjectId | string;
    title: string;
    content: string;
    image?: string;
    tags?: string[];
    categories?: string[];
    author: Types.ObjectId | string;
    published?: boolean;
    publishedAt?: Date | null;
    comments?: {
        user: Types.ObjectId | string;
        comment: string;
        createdAt: Date;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
}