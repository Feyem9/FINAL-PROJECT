import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsUrl,
  IsOptional,
  Length,
} from 'class-validator';

export enum ResourceType {
  SHEET_MUSIC = 'sheet_music',
  VIDEO = 'video',
  AUDIO = 'audio',
  ARTICLE = 'article',
}

export enum ResourceLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export class CreateMusicResourceDto {
  @ApiProperty({ description: 'The title of the music resource' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  readonly title: string;

  @ApiProperty({ description: 'The description of the music resource' })
  @IsString()
  @IsNotEmpty()
  @Length(10, 2000)
  readonly description: string;

  @ApiProperty({ enum: ResourceType, description: 'The type of the music resource' })
  @IsEnum(ResourceType)
  readonly type: ResourceType;

  @ApiProperty({ description: 'The URL of the music resource' })
  @IsUrl()
  readonly url: string;

  @ApiProperty({ enum: ResourceLevel, description: 'The level of the music resource' })
  @IsEnum(ResourceLevel)
  readonly level: ResourceLevel;

  @ApiProperty({ description: 'The instrument associated with the music resource' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  readonly instrument: string;
}

export class UpdateMusicResourceDto {
  @ApiProperty({ description: 'The title of the music resource', required: false })
  @IsString()
  @IsOptional()
  @Length(2, 100)
  readonly title?: string;

  @ApiProperty({ description: 'The description of the music resource', required: false })
  @IsString()
  @IsOptional()
  @Length(10, 2000)
  readonly description?: string;

  @ApiProperty({ enum: ResourceType, description: 'The type of the music resource', required: false })
  @IsEnum(ResourceType)
  @IsOptional()
  readonly type?: ResourceType;

  @ApiProperty({ description: 'The URL of the music resource', required: false })
  @IsUrl()
  @IsOptional()
  readonly url?: string;

  @ApiProperty({ enum: ResourceLevel, description: 'The level of the music resource', required: false })
  @IsEnum(ResourceLevel)
  @IsOptional()
  readonly level?: ResourceLevel;

  @ApiProperty({ description: 'The instrument associated with the music resource', required: false })
  @IsString()
  @IsOptional()
  @Length(2, 50)
  readonly instrument?: string;
}
