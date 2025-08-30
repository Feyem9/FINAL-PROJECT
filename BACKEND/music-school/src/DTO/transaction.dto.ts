import { IsString, IsNumber, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class TransactionItemDto {
  @ApiProperty({ description: 'The ID of the course', example: '12345' })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({ description: 'The name of the course', example: 'Introduction to Music' })
  @IsString()
  @IsNotEmpty()
  courseName: string;

  @ApiProperty({ description: 'The image of the course', example: 'https://example.com/image.jpg' })
  @IsString()
  @IsNotEmpty()
  courseImage: string;

  @ApiProperty({ description: 'The description of the course', example: 'Learn the basics of music theory' })
  @IsString()
  @IsNotEmpty()
  courseDescription: string;

  @ApiProperty({ description: 'The quantity of the course', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: 'The price of the course', example: 99.99 })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export class PaymentDetailsDto {
  @ApiProperty({ description: 'Last four digits of card', example: '1234', required: false })
  @IsOptional()
  @IsString()
  cardLastFour?: string;

  @ApiProperty({ description: 'PayPal email', example: 'user@example.com', required: false })
  @IsOptional()
  @IsString()
  paypalEmail?: string;

  @ApiProperty({ description: 'Bank transfer reference', example: 'BT123456', required: false })
  @IsOptional()
  @IsString()
  bankReference?: string;
}

export class CreateTransactionDto {
  @ApiProperty({ description: 'The ID of the user making the transaction', example: 'user123' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Array of items in the transaction', type: [TransactionItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionItemDto)
  items: TransactionItemDto[];

  @ApiProperty({ description: 'Total amount of the transaction', example: 199.98 })
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @ApiProperty({ 
    description: 'Payment method', 
    example: 'card',
    enum: ['card', 'paypal', 'bank_transfer']
  })
  @IsEnum(['card', 'paypal', 'bank_transfer'])
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({ description: 'Payment details', type: PaymentDetailsDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  paymentDetails?: PaymentDetailsDto;
}

export class UpdateTransactionDto {
  @ApiProperty({ 
    description: 'Transaction status', 
    example: 'completed',
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    required: false
  })
  @IsOptional()
  @IsEnum(['pending', 'completed', 'failed', 'cancelled'])
  status?: string;

  @ApiProperty({ description: 'Payment details', type: PaymentDetailsDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  paymentDetails?: PaymentDetailsDto;
}