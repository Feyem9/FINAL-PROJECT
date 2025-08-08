import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
    @ApiProperty({
        description: 'Titre de la note',
        example: 'Note de réunion',
    })
  @IsNotEmpty()
  @IsString()
  title: string;

    @ApiProperty({
        description: 'Contenu de la note',
        example: 'Discussion sur les projets en cours',
    })
  @IsOptional()
  @IsString()
  content: string;
}

export class UpdateNoteDto {

    @ApiProperty({
        description: 'Titre de la note',
        example: 'Note de réunion',
        required: false,
    })
  @IsOptional()
  @IsString()
  title?: string;


    @ApiProperty({
        description: 'Contenu de la note',
        example: 'Discussion sur les projets en cours',
        required: false,
    })
  @IsOptional()
  @IsString()
  content?: string;
}