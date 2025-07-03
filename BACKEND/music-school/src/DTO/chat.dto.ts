import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatDto {
@ApiProperty({
  description: 'The ID of the sender',
  example: '64b7f3c2e4b0f5a1d2c3e4f5',
})
  @IsString()
  @IsNotEmpty()
  readonly senderId: string;

@ApiProperty({
  description: 'The ID of the receiver',
  example: '64b7f3c2e4b0f5a1d2c3e4f6',
})
  @IsString()
  @IsNotEmpty()
  readonly receiverId: string;

@ApiProperty({
  description: 'The message content',
  example: 'Hello, how can I help you?',
})
  @IsString()
  @IsNotEmpty()
  readonly message: string;

@ApiProperty({
  description: 'Indicates if the message has been read',
  example: false,
  default: false,   
})
  @IsBoolean()
  @IsOptional()
  readonly isRead?: boolean;
}