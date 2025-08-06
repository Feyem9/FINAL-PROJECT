import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateBlogDto {
    @ApiProperty({ example: 'Les bases du piano', description: 'Titre du blog' })
    title: string;

    @ApiProperty({ example: 'Découvrez les bases du piano pour débutants...', description: 'Contenu du blog' })
    content: string;

    @ApiProperty({ example: 'https://exemple.com/image.jpg', description: 'URL de l\'image', required: false })
    image?: string;

    @ApiProperty({ example: ['musique', 'piano'], description: 'Tags du blog', required: false, type: [String] })
    tags?: string[];

    @ApiProperty({ example: ['cours', 'débutant'], description: 'Catégories du blog', required: false, type: [String] })
    categories?: string[];

    @ApiProperty({ example: '64b7f3c2e4b0f5a1d2c3e4f5', description: 'ID de l\'auteur', required: true })
    author: Types.ObjectId | string;
}

export class UpdateBlogDto {
    @ApiProperty({ example: 'Nouveau titre', description: 'Titre du blog', required: false })
    title?: string;

    @ApiProperty({ example: 'Nouveau contenu...', description: 'Contenu du blog', required: false })
    content?: string;

    @ApiProperty({ example: 'https://exemple.com/nouvelle-image.jpg', description: 'URL de l\'image', required: false })
    image?: string;

    @ApiProperty({ example: ['avancé'], description: 'Tags du blog', required: false, type: [String] })
    tags?: string[];

    @ApiProperty({ example: ['avancé'], description: 'Catégories du blog', required: false, type: [String] })
    categories?: string[];

    @ApiProperty({ example: true, description: 'Statut de publication', required: false })
    published?: boolean;
}