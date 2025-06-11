import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CalenderDto {

    @ApiProperty({
        description: 'The title of the shedule',
        example: 'reunion avec tous les enseignant',
    })
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @ApiProperty({
        description: 'The description of the shedule',
        example: 'reunion avec tous les enseignant a propos de leurs salaire',
    })
    @IsNotEmpty()
    @IsString()
    readonly description: string;


    @ApiProperty({
        description: 'The startin date of the shedule',
        example: '22-05-2025 12:30:00 utc',
    })
    @IsNotEmpty()
    @IsString()
    readonly start_date: Date;

    @ApiProperty({
        description: 'The ending date of the shedule',
        example: '22-05-2025 15:00:00 utc',
    })
    @IsNotEmpty()
    @IsString()
    readonly end_date: Date;

    @ApiProperty({
        description: 'To who the shedule is concerning',
        example: 'student and teacher',
    })
    @IsNotEmpty()
    @IsString()
    readonly audience: 'teacher' | 'student' | 'teacher_and_student';

    @ApiProperty({
        description: 'ID of the user who created the event',
        example: '665f1c2b8e4b2a0012a4e123',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly creator?: string;
}