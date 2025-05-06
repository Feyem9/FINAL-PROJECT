import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './userDto';

export class StudentDto extends UserDto {
    @ApiProperty({
        description: 'The level of the student (e.g., "Beginner", "Intermediate", "Advanced")',
        example: 'Beginner',
    })
    @IsNotEmpty()
    @IsString()
    readonly level: string; // 📌 Niveau de l’élève (ex: "Débutant", "Intermédiaire", "Avancé")

    @ApiProperty({
        description: 'The instrument the student wants to learn (e.g., "Piano", "Guitar")',
        example: 'Piano',
    })
    @IsNotEmpty()
    @IsString()
    readonly instrument: string; // 📌 Instrument que l'élève veut apprendre (ex: "Piano", "Guitare")

    @ApiProperty({
        description: 'List of course IDs the student is enrolled in',
        example: ['64b7f3c2e4b0f5a1d2c3e4f5', '64b7f3c2e4b0f5a1d2c3e4f6'],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    readonly enrolledCourses?: string[] = []; // 📌 Liste des IDs des cours suivis par l’élève

    @ApiProperty({
        description: 'The role of the user, which is fixed to "student"',
        example: 'student',
        readOnly: true,
    })
    readonly role: 'student' = 'student'; // 🔒 Rôle forcé à "student"
}