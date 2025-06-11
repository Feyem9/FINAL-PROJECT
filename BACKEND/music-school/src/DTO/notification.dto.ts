import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from "class-validator";

export class NotificationDto {
  @ApiProperty({
    description: 'Titre de la notification',
    example: 'Nouvel événement',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Message de la notification',
    example: 'Vous avez une réunion avec tous les enseignants',
  })
  @IsNotEmpty()
  @IsString()
  readonly message: string;

  @ApiProperty({
    description: "ID de l'utilisateur destinataire",
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsString()
  readonly user_id: string;

  @ApiProperty({
    description: "ID de l'événement lié à la notification (optionnel)",
    example: '1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly event_id?: string;

  @ApiProperty({
    description: 'Statut de lecture de la notification',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly read?: boolean = false;
}