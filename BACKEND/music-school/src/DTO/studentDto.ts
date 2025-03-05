import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';
import { UserDto } from './userDto';

export class StudentDto extends UserDto {
    @IsNotEmpty()
    @IsString()
    readonly level: string; // 📌 Niveau de l’élève (ex: "Débutant", "Intermédiaire", "Avancé")
    
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    readonly courses?: string[] = []; // 📌 Liste des IDs des cours suivis par l’élève
    
    readonly role: 'student' = 'student'; // 🔒 Rôle forcé à "student"
}