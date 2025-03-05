import { IsOptional, IsBoolean } from "class-validator";
import { UserDto } from "./userDto";

export class AdminDto extends UserDto {
    @IsOptional()
    @IsBoolean()
    readonly isSuperAdmin?: boolean = true;
  
    readonly role: 'admin' = 'admin'; // Force le rôle à "admin"
  }
  