import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CourseDto {
    @ApiProperty({
        description: 'The title of the course',
        example: 'Introduction to Piano',
    })
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @ApiProperty({
        description: 'A brief description of the course',
        example: 'Learn the basics of playing the piano in this beginner-friendly course.',
    })
    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @ApiProperty({
        description: 'The price of the course in USD',
        example: 49.99,
    })
    @IsNotEmpty()
    @IsNumber()
    readonly amount: number;

    @ApiProperty({
        description: 'The category of the course',
        example: 'piano',
        enum: ['piano', 'flute', 'violon', 'baterie'],
    })
    @IsNotEmpty()
    @IsString()
    readonly category: 'piano' | 'flute' | 'violon' | 'baterie';

    @ApiProperty({
        description: 'The difficulty level of the course',
        example: 'beginner',
        enum: ['beginner', 'intermediate', 'advanced'],
    })
    @IsNotEmpty()
    @IsString()
    readonly level: 'beginner' | 'intermediate' | 'advanced';

    @ApiProperty({
        description: 'The type of media used in the course',
        example: 'video',
        enum: ['video', 'pdf', 'audio'],
    })
    @IsNotEmpty()
    @IsString()
    readonly media: 'video' | 'pdf' | 'audio';

    @ApiProperty({
        description: 'The ID of the teacher who created the course',
        example: '64b7f3c2e4b0f5a1d2c3e4f5',
    })
    @IsNotEmpty()
    @IsString()
    readonly teacher_id: string;

    @ApiProperty({
        description: 'The URL or path of the course image (optional)',
        example: 'https://example.com/course-image.jpg',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly image?: string;

    @ApiProperty({
        description: 'The URL or path of the course media file (optional)',
        example: 'https://example.com/course-media/video.mp4',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly fileUrl?: string;
}