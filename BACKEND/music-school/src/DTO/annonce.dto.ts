import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class AnnonceDto {

    @ApiProperty({
        description: 'The title of the announce',
        example: 'music concert',
    })
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @ApiProperty({
        description: 'The type of the announce',
        example: 'event',
        enum: ['event', 'training', 'sale'],
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    readonly type: 'event' | 'training' | 'sale';

    @ApiProperty({
        description: 'The description of the announce',
        example: 'A music concert featuring local artists will be taking place at bonaberi',
    })
    @IsNotEmpty()
    @IsString()
    readonly description: string;


    @ApiProperty({
        description: 'The  date of the announce',
        example: '22-05-2025 12:30:00 utc',
    })
    @IsNotEmpty()
    @IsString()
    readonly date: Date;

    @ApiProperty({
        description: 'The link of the announce',
        example: 'https://example.com/announce',
    })
    @IsNotEmpty()
    @IsString()
    readonly link: string;

    @ApiProperty({
        description: 'The image of the announce',
        example: 'https://example.com/image.jpg',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly image?: string;

    @ApiProperty({
        description: 'The location of the announce',
        example: 'Bonaberi, Douala, Cameroon',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly location?: string;

    @ApiProperty({
        description: 'The ID of the user who created the announce',
        example: '60c72b2f9b1e8b001c8e4d3a',
    })
    @IsOptional()
    @IsString()
    readonly createdBy: string;

}