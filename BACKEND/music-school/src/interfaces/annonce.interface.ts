import { Document } from 'mongoose';


export interface Notification extends Document {
    title: string;
    type: ['event' | 'training' | 'sale'];
    description: string;
    date: Date;
    link: string;
    image?: string;
    location?: string;
    createdBy: string;
    createdAt?: Date;
    updatedAt?: Date;
}