import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';
import { UserDto } from './userDto';

export class TeacherDto extends UserDto {
  @IsNotEmpty()
  @IsString()
  readonly speciality: string; // 📌 Matière enseignée (ex: "Piano", "Guitare", "Solfège")

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly courses?: string[]; // 📌 Liste des IDs des cours créés par l’enseignant

  readonly role: 'teacher' = 'teacher'; // 🔒 Rôle forcé à "teacher"
}
