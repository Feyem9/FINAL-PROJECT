import { IsOptional, IsBoolean } from "class-validator";
import { UserDto } from "./userDto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AdminDto extends UserDto {
  @ApiPropertyOptional({
    description: 'Indicates if the admin has super admin privileges',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly isSuperAdmin?: boolean = true; // Optionnel, par défaut à "true"

  @ApiProperty({
    description: 'The role of the user, which is fixed to "admin"',
    example: 'admin',
    readOnly: true,
  })
  readonly role: 'admin' = 'admin'; // 🔒 Rôle forcé à "admin"
}
