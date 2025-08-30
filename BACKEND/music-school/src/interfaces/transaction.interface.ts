import { Document } from "mongodb";

export interface Transaction extends Document {
    userId: string;
    items: {
        courseId: string;
        courseName: string;
        courseImage: string;
        courseDescription: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    paymentMethod: 'card' | 'paypal' | 'bank_transfer';
    paymentDetails?: {
        cardLastFour?: string;
        paypalEmail?: string;
        bankReference?: string;
    };
    transactionId: string;
    createdAt: Date;
    updatedAt: Date;
}