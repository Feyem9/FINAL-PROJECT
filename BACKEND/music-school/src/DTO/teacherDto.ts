import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './userDto';

export class TeacherDto extends UserDto {
  @ApiProperty({
    description: 'The speciality of the teacher (e.g., "Piano", "Guitar", "Music Theory")',
    example: 'Piano',
  })
  @IsNotEmpty()
  @IsString()
  readonly speciality: string; // 📌 Matière enseignée (ex: "Piano", "Guitare", "Solfège")

  @ApiProperty({
    description: 'List of course IDs created by the teacher',
    example: ['64b7f3c2e4b0f5a1d2c3e4f5', '64b7f3c2e4b0f5a1d2c3e4f6'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly courses?: string[]; // 📌 Liste des IDs des cours créés par l’enseignant

  @ApiProperty({
    description: 'The role of the user, which is fixed to "teacher"',
    example: 'teacher',
    readOnly: true,
  })
  readonly role: 'teacher' = 'teacher'; // 🔒 Rôle forcé à "teacher"
}
