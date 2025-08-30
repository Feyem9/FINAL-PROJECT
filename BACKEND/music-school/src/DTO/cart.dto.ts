import { IsString, IsNumber, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CartDto {
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
