import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
  HttpStatus,
  HttpCode,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createReadStream, existsSync } from 'fs';
import { ProfileImageService } from './profile-image.service';
import { IProfileImage } from '../../../../interfaces/profileImage.interface';

// Configuration multer pour l'upload d'images
const imageStorage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Assurez-vous que ce dossier existe
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Filtre pour valider les types d'images
const imageFileFilter = (req: any, file: any, cb: any) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Seuls les fichiers images sont autorisés (JPEG, PNG, GIF, WebP)'), false);
  }
};

@ApiTags('Profile Images')
@Controller('profile-images')
export class ProfileImageController {
  constructor(private readonly profileImageService: ProfileImageService) {}

  // NOUVEL ENDPOINT: Servir les fichiers images
  @Get('file/:filename')
  @ApiOperation({ summary: 'Récupérer un fichier image par nom de fichier' })
  @ApiParam({ name: 'filename', description: 'Nom du fichier image' })
  @ApiResponse({ status: 200, description: 'Fichier image retourné' })
  @ApiResponse({ status: 404, description: 'Fichier non trouvé' })
  async getImageFile(@Param('filename') filename: string, @Res({ passthrough: true }) res: Response) {
    const filePath = join(process.cwd(), 'uploads', filename);
    
    if (!existsSync(filePath)) {
      throw new NotFoundException('Fichier image non trouvé');
    }

    // Déterminer le type MIME basé sur l'extension
    const ext = extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };

    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    
    res.set({
      'Content-Type': mimeType,
      'Cache-Control': 'public, max-age=31536000', // Cache 1 an
      'Cross-Origin-Resource-Policy': 'cross-origin',
    });

    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }

  // NOUVEL ENDPOINT: Récupérer l'image de profil d'un utilisateur (fichier direct)
  @Get('user/:userId/file')
  @ApiOperation({ summary: 'Récupérer le fichier image de profil d\'un utilisateur' })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Fichier image de profil' })
  @ApiResponse({ status: 404, description: 'Image de profil non trouvée' })
  async getUserProfileImageFile(@Param('userId') userId: string, @Res({ passthrough: true }) res: Response) {
    const profileImage = await this.profileImageService.getProfileImageByUserId(userId);
    
    if (!profileImage) {
      throw new NotFoundException('Aucune image de profil trouvée pour cet utilisateur');
    }

    // Extraire le nom de fichier de l'URL
    const filename = profileImage.imageUrl.split('/').pop();
    const filePath = join(process.cwd(), 'uploads', filename);
    
    if (!existsSync(filePath)) {
      throw new NotFoundException('Fichier image physique non trouvé');
    }

    res.set({
      'Content-Type': profileImage.mimeType,
      'Cache-Control': 'public, max-age=31536000',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    });

    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }

  @Post('upload/:userId')
  @ApiOperation({ summary: 'Upload ou mettre à jour une image de profil' })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Image uploadée avec succès' })
  @ApiResponse({ status: 400, description: 'Fichier invalide ou données manquantes' })
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: imageStorage,
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
    }),
  )
  async uploadProfileImage(
    @Param('userId') userId: string,
    @Body('userType') userType: 'admin' | 'teacher' | 'student',
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      // Validation des paramètres
      if (!userId) {
        throw new BadRequestException('L\'ID utilisateur est requis');
      }

      if (!userType || !['admin', 'teacher', 'student'].includes(userType)) {
        throw new BadRequestException('Le type d\'utilisateur doit être admin, teacher ou student');
      }

      if (!file) {
        throw new BadRequestException('Aucun fichier image fourni');
      }

      console.log('📁 Upload reçu:', {
        userId,
        userType,
        filename: file.filename,
        originalname: file.originalname,
        size: file.size
      });

      // Construire l'URL du fichier
      const imageUrl = `/uploads/${file.filename}`;

      // Sauvegarder via le service
      const profileImage = await this.profileImageService.uploadProfileImage(
        userId,
        userType,
        imageUrl,
        file.originalname,
        file.size,
        file.mimetype,
      );

      console.log('✅ Profile image sauvegardée:', profileImage);

      return {
        success: true,
        message: 'Image de profil uploadée avec succès',
        data: {
          id: profileImage._id,
          userId: profileImage.userId,
          userType: profileImage.userType,
          imageUrl: profileImage.imageUrl,
          // URL complète pour le frontend
          fullImageUrl: `/profile-images/file/${file.filename}`,
          fileName: profileImage.fileName,
          fileSize: profileImage.fileSize,
          mimeType: profileImage.mimeType,
          uploadedAt: profileImage.uploadedAt,
        },
      };
    } catch (error) {
      console.error('❌ Erreur lors de l\'upload:', error);
      throw error;
    }
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Récupérer les métadonnées de l\'image de profil d\'un utilisateur' })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Métadonnées de l\'image de profil trouvée' })
  @ApiResponse({ status: 404, description: 'Aucune image de profil trouvée' })
  async getUserProfileImage(@Param('userId') userId: string) {
    try {
      const profileImage = await this.profileImageService.getProfileImageByUserId(userId);
      
      if (!profileImage) {
        throw new NotFoundException('Aucune image de profil trouvée pour cet utilisateur');
      }

      // Extraire le nom de fichier pour construire l'URL complète
      const filename = profileImage.imageUrl.split('/').pop();

      return {
        success: true,
        data: {
          ...profileImage.toObject(),
          fullImageUrl: `/profile-images/file/${filename}`, // URL complète pour le frontend
        },
      };
    } catch (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      throw error;
    }
  }

  @Get('type/:userType')
  @ApiOperation({ summary: 'Récupérer toutes les images de profil par type d\'utilisateur' })
  @ApiParam({ name: 'userType', description: 'Type d\'utilisateur (admin, teacher, student)' })
  @ApiQuery({ name: 'page', required: false, description: 'Numéro de page' })
  @ApiQuery({ name: 'limit', required: false, description: 'Nombre d\'éléments par page' })
  @ApiResponse({ status: 200, description: 'Images de profil récupérées' })
  async getProfileImagesByType(
    @Param('userType') userType: 'admin' | 'teacher' | 'student',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      if (!['admin', 'teacher', 'student'].includes(userType)) {
        throw new BadRequestException('Type d\'utilisateur invalide');
      }

      const profileImages = await this.profileImageService.getProfileImagesByType(
        userType,
        page,
        limit,
      );

      return {
        success: true,
        data: profileImages,
        pagination: {
          page: Number(page),
          limit: Number(limit),
        },
      };
    } catch (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      throw error;
    }
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Supprimer l\'image de profil d\'un utilisateur' })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Image de profil supprimée' })
  @ApiResponse({ status: 404, description: 'Image de profil non trouvée' })
  async deleteProfileImage(@Param('userId') userId: string) {
    try {
      const result = await this.profileImageService.deleteProfileImage(userId);
      
      if (!result) {
        throw new NotFoundException('Aucune image de profil trouvée pour cet utilisateur');
      }

      return {
        success: true,
        message: 'Image de profil supprimée avec succès',
      };
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      throw error;
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Récupérer les statistiques des images de profil' })
  @ApiResponse({ status: 200, description: 'Statistiques récupérées' })
  async getProfileImageStats() {
    try {
      const stats = await this.profileImageService.getProfileImageStats();
      
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des stats:', error);
      throw error;
    }
  }

  @Post('validate/:userId')
  @ApiOperation({ summary: 'Valider l\'existence d\'une image de profil' })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Validation effectuée' })
  async validateProfileImage(@Param('userId') userId: string) {
    try {
      const exists = await this.profileImageService.profileImageExists(userId);
      
      return {
        success: true,
        data: {
          userId,
          hasProfileImage: exists,
        },
      };
    } catch (error) {
      console.error('❌ Erreur lors de la validation:', error);
      throw error;
    }
  }
}