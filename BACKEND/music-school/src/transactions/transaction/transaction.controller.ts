import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    HttpStatus,
    HttpCode,
    HttpException,
    Res
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto, UpdateTransactionDto } from 'src/DTO/transaction.dto';
import { Transaction } from 'src/schema/transaction.schema';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new transaction' })
    @ApiResponse({ status: 201, description: 'Transaction created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async createTransaction(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        return this.transactionService.createTransaction(createTransactionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all transactions or filter by user ID' })
    @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
    @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
    async getTransactions(@Query('userId') userId?: string): Promise<Transaction[]> {
        if (userId) {
            return this.transactionService.getTransactionsByUserId(userId);
        }
        return this.transactionService.getAllTransactions();
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get transaction statistics' })
    @ApiQuery({ name: 'userId', required: false, description: 'Get stats for specific user' })
    @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
    async getTransactionStats(@Query('userId') userId?: string): Promise<any> {
        return this.transactionService.getTransactionStats(userId);
    }

    @Get('status/:status')
    @ApiOperation({ summary: 'Get transactions by status' })
    @ApiParam({ name: 'status', enum: ['pending', 'completed', 'failed', 'cancelled'] })
    @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
    async getTransactionsByStatus(@Param('status') status: string): Promise<Transaction[]> {
        return this.transactionService.getTransactionsByStatus(status);
    }

    @Get(':transactionId')
    @ApiOperation({ summary: 'Get transaction by ID' })
    @ApiParam({ name: 'transactionId', description: 'Transaction ID' })
    @ApiResponse({ status: 200, description: 'Transaction retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Transaction not found' })
    async getTransactionById(@Param('transactionId') transactionId: string): Promise<Transaction> {
        return this.transactionService.getTransactionById(transactionId);
    }

    @Patch(':transactionId')
    @ApiOperation({ summary: 'Update transaction' })
    @ApiParam({ name: 'transactionId', description: 'Transaction ID' })
    @ApiResponse({ status: 200, description: 'Transaction updated successfully' })
    @ApiResponse({ status: 404, description: 'Transaction not found' })
    async updateTransaction(
        @Param('transactionId') transactionId: string,
        @Body() updateTransactionDto: UpdateTransactionDto,
    ): Promise<Transaction> {
        return this.transactionService.updateTransaction(transactionId, updateTransactionDto);
    }

    @Post(':transactionId/process')
    @ApiOperation({ summary: 'Process payment for transaction' })
    @ApiParam({ name: 'transactionId', description: 'Transaction ID' })
    @ApiResponse({ status: 200, description: 'Payment processed successfully' })
    @ApiResponse({ status: 400, description: 'Payment processing failed' })
    @ApiResponse({ status: 404, description: 'Transaction not found' })
    async processPayment(@Param('transactionId') transactionId: string): Promise<Transaction> {
        return this.transactionService.processPayment(transactionId);
    }

    @Post(':transactionId/cancel')
    @ApiOperation({ summary: 'Cancel transaction' })
    @ApiParam({ name: 'transactionId', description: 'Transaction ID' })
    @ApiResponse({ status: 200, description: 'Transaction cancelled successfully' })
    @ApiResponse({ status: 400, description: 'Cannot cancel transaction' })
    @ApiResponse({ status: 404, description: 'Transaction not found' })
    async cancelTransaction(@Param('transactionId') transactionId: string): Promise<Transaction> {
        return this.transactionService.cancelTransaction(transactionId);
    }

    @Delete(':transactionId')
    @ApiOperation({ summary: 'Delete transaction (admin only)' })
    @ApiParam({ name: 'transactionId', description: 'Transaction ID' })
    @ApiResponse({ status: 204, description: 'Transaction deleted successfully' })
    @ApiResponse({ status: 404, description: 'Transaction not found' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteTransaction(@Param('transactionId') transactionId: string): Promise<void> {
        await this.transactionService.deleteTransaction(transactionId);
    }

    @Post('/checkout')
    @ApiOperation({ summary: 'Initiate checkout process' })
    @ApiResponse({ status: 200, description: 'Checkout initiated successfully' })
    async checkout(@Body() checkoutDto: any): Promise<any> {
        try {
            return this.transactionService.initializePayunitClient();
        } catch (error) {
            throw new HttpException('Checkout failed', HttpStatus.BAD_REQUEST);
        }
    }

    @Post("notify")
    notify(@Body() body: any) {
        console.log("Notification Payunit:", body);
        return { received: true };
    }

    // @Post('/checkouts')
    // async checkouts(@Res() res) {
    //     const { redirectUrl } = await this.transactionService.createTransactions();
    //     return res.json({ redirectUrl });
    // }
}