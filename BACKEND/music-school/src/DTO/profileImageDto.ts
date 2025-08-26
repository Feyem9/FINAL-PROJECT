import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class UploadProfileImageDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(['admin', 'teacher', 'student'])
  userType: 'admin' | 'teacher' | 'student';
}

export class ProfileImageResponseDto {
  userId: string;
  userType: 'admin' | 'teacher' | 'student';
  imageUrl: string;
  uploadedAt: Date;
  fileName: string;
}