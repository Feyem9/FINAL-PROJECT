import { IsNotEmpty, IsString, IsOptional, IsMongoId, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateNoteDto {
  @ApiProperty({
    description: 'Titre de la note',
    example: 'Note de réunion',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  title: string;

  @ApiProperty({
    description: 'Contenu de la note',
    example: 'Discussion sur les projets en cours',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Transform(({ value }) => value.trim())
  content: string;

  @ApiProperty({
    description: 'ID de l\'auteur de la note',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @IsMongoId()
  authorId: string;
}

export class UpdateNoteDto {
  @ApiProperty({
    description: 'ID de l\'auteur de la note',
    example: '507f1f77bcf86cd799439011',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  authorId: string;

  @ApiProperty({
    description: 'Titre de la note',
    example: 'Note de réunion',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  title?: string;


  @ApiProperty({
    description: 'Contenu de la note',
    example: 'Discussion sur les projets en cours',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Transform(({ value }) => value.trim())
  content?: string;
}