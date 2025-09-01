import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransactionDto, UpdateTransactionDto } from 'src/DTO/transaction.dto';
import { Transaction, TransactionDocument } from 'src/schema/transaction.schema';
import { v4 as uuidv4 } from 'uuid';
import { PayunitClient } from '@payunit/nodejs-sdk';

@Injectable()
export class TransactionService {
    constructor(
        @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    ) { }

    // Create a new transaction
    async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        try {
            const transactionData = {
                ...createTransactionDto,
                transactionId: uuidv4(), // Generate unique transaction ID
                status: 'pending'
            };

            const newTransaction = new this.transactionModel(transactionData);
            return await newTransaction.save();
        } catch (error) {
            throw new BadRequestException('Failed to create transaction');
        }
    }

    // Get all transactions
    async getAllTransactions(): Promise<Transaction[]> {
        return this.transactionModel.find().sort({ createdAt: -1 }).exec();
    }

    // Get transactions by user ID
    async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
        return this.transactionModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .exec();
    }

    // Get transaction by transaction ID
    async getTransactionById(transactionId: string): Promise<Transaction> {
        const transaction = await this.transactionModel
            .findOne({ transactionId })
            .exec();

        if (!transaction) {
            throw new NotFoundException(`Transaction with ID ${transactionId} not found`);
        }

        return transaction;
    }

    // Update transaction status
    async updateTransaction(transactionId: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
        const updatedTransaction = await this.transactionModel
            .findOneAndUpdate(
                { transactionId },
                updateTransactionDto,
                { new: true }
            )
            .exec();

        if (!updatedTransaction) {
            throw new NotFoundException(`Transaction with ID ${transactionId} not found`);
        }

        return updatedTransaction;
    }

    // Process payment (simulation)
    async processPayment(transactionId: string): Promise<Transaction> {
        const transaction = await this.getTransactionById(transactionId);

        if (transaction.status !== 'pending') {
            throw new BadRequestException('Transaction is not in pending status');
        }

        // Simulate payment processing
        // In a real application, this would integrate with payment providers
        const paymentSuccessful = Math.random() > 0.1; // 90% success rate for demo

        const newStatus = paymentSuccessful ? 'completed' : 'failed';

        return this.updateTransaction(transactionId, { status: newStatus });
    }

    // Cancel transaction
    async cancelTransaction(transactionId: string): Promise<Transaction> {
        const transaction = await this.getTransactionById(transactionId);

        if (transaction.status === 'completed') {
            throw new BadRequestException('Cannot cancel a completed transaction');
        }

        return this.updateTransaction(transactionId, { status: 'cancelled' });
    }

    // Get transaction statistics
    async getTransactionStats(userId?: string): Promise<any> {
        const matchStage = userId ? { $match: { userId } } : { $match: {} };

        const stats = await this.transactionModel.aggregate([
            matchStage,
            {
                $group: {
                    _id: null,
                    totalTransactions: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' },
                    completedTransactions: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    pendingTransactions: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    },
                    failedTransactions: {
                        $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
                    },
                    cancelledTransactions: {
                        $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
                    },
                    averageAmount: { $avg: '$totalAmount' }
                }
            }
        ]);

        return stats[0] || {
            totalTransactions: 0,
            totalAmount: 0,
            completedTransactions: 0,
            pendingTransactions: 0,
            failedTransactions: 0,
            cancelledTransactions: 0,
            averageAmount: 0
        };
    }

    // Get transactions by status
    async getTransactionsByStatus(status: string): Promise<Transaction[]> {
        return this.transactionModel
            .find({ status })
            .sort({ createdAt: -1 })
            .exec();
    }

    // Delete transaction (admin only)
    async deleteTransaction(transactionId: string): Promise<void> {
        const result = await this.transactionModel
            .findOneAndDelete({ transactionId })
            .exec();

        if (!result) {
            throw new NotFoundException(`Transaction with ID ${transactionId} not found`);
        }
    }

    // Initialiser avec la configuration
    async initializePayunitClient() {

        console.log("PAYUNIT CONFIG:", {
            baseURL: process.env.PAYUNIT_BASE_URL,
            apiKey: process.env.PAYUNIT_X_API_KEY,
            apiUsername: process.env.PAYUNIT_API_USER_NAME,
            apiPassword: process.env.PAYUNIT_API_PASSWORD,
            mode: process.env.PAYUNIT_MODE,
            timeout: process.env.PAYUNIT_TIMEOUT,
        });

        const modeEnv = process.env.PAYUNIT_MODE;
        const mode: "test" | "live" = modeEnv === "live" ? "live" : "test";

        const client = new PayunitClient({
            baseURL: process.env.PAYUNIT_BASE_URL, // facultatif    
            apiKey: process.env.PAYUNIT_X_API_KEY,
            apiUsername: process.env.PAYUNIT_API_USER_NAME,
            apiPassword: process.env.PAYUNIT_API_PASSWORD,
            mode,
            timeout: Number(process.env.PAYUNIT_TIMEOUT),
        });
        console.log(client)

        const transaction = await client.checkout.initialize({
            transaction_id: Date.now().toString(),
            total_amount: 5000,           // montant total
            currency: "XAF",
            mode: "payment",              // "payment" ou "subscription"
            success_url: "https://final-project-rhl2-git-main-christians-projects-9c9bef59.vercel.app/home",
            cancel_url: "https://final-project-rhl2-git-main-christians-projects-9c9bef59.vercel.app/home",
            notify_url: "https://final-project-rhl2-git-main-christians-projects-9c9bef59.vercel.app/home",
            items: [
                {
                    quantity: 1,
                    price_description: {
                        unit_amount: 5000
                    },
                    product_description: {
                        name: "Cours de musique",
                        about_product: "Cours test pour Museschool",
                        image_url: "http://localhost:5173/assets/course.png"
                    }
                }
            ],
            meta: {
                phone_number_collection: true,
                address_collection: false
            }
        });

        console.log("Checkout response:", transaction);
        return transaction;
    }

}
