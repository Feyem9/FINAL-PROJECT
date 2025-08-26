import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Param,
    Req,
    UseGuards,
    Get,
    Query,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { ProfileService } from './profile.service';
import { Roles } from '../../role/role.decorator';
import { Role } from '../../role/role.enum';
import { RolesGuard } from '../../role/role.guard';
import { log } from 'console';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

// Options for file upload with Multer
export const multerOptions = {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
            const uniqueSuffix = uuidv4() + path.extname(file.originalname);
            callback(null, uniqueSuffix);
        },
    }),
};

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    // @Post('upload-image/:userId')
    // @UseGuards(RolesGuard)
    // @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    // @UseInterceptors(FileInterceptor('image', multerOptions))
    // async uploadProfileImage(
    //     @Param('userId') userId: string,
    //     @UploadedFile() file: Express.Multer.File,
    //     @Req() req: any,
    // ) {
    //     // Check if user is updating their own profile or admin updating any profile
    //     const user = req.user;
    //     if (user.role !== 'admin' && user.sub !== userId) {
    //         throw new Error('Access denied: you can only update your own profile');
    //     }

    //     if (!file) {
    //         throw new Error('No file provided');
    //     }

    //     const imagePath = `/uploads/${file.filename}`;
    //     const updatedUser = await this.profileService.updateProfileImage(
    //         userId,
    //         user.role,
    //         imagePath,
    //     );

    //     return {
    //         message: 'Profile image uploaded successfully',
    //         imagePath: imagePath,
    //         user: updatedUser,
    //     };
    // }

    @Get('location')
    async getLocation(@Req() req: Request) {
        // This endpoint is for IP-based location detection
        // Si derrière un proxy (nginx, cloudflare), on prend x-forwarded-for
        const forwarded = req.headers['x-forwarded-for'];
        const ip = typeof forwarded === 'string'
            ? forwarded.split(',')[0]
            : req.socket?.remoteAddress; // Use socket instead of connection

        return await this.profileService.getUserLocationByIP(ip);
    }

    @Get('gps-location')
    async getGpsLocation(
        @Req() req: Request,
        @Param('lat') lat: number,
        @Param('lon') lon: number
    ) {
        // This endpoint is for GPS-based location detection
        // The frontend should use the browser's Geolocation API to get real GPS coordinates
        // and send them to this endpoint
        console.log(`Received GPS coordinates: ${lat}, ${lon}`);

        return await this.profileService.getUserLocationByGPS(lat, lon);
    }

    @Post(':id/upload-profile-image')
    @UseInterceptors(FileInterceptor('file', multerOptions)) // Correspond au frontend
    @ApiOperation({ summary: 'Upload a profile image for a teacher' })
    @ApiResponse({ status: 200, description: 'Profile image uploaded successfully' })
    @ApiResponse({ status: 404, description: 'Teacher not found' })
    async uploadProfileImage(
      @Param('id') id: string,
      @UploadedFile() file: Express.Multer.File
    ) {
      try {
        if (!file) {
          throw new BadRequestException('Aucun fichier reçu');
        }
        
        console.log('📁 Fichier reçu pour teacher:', {
          teacherId: id,
          originalname: file.originalname,
          filename: file.filename,
          size: file.size,
          mimetype: file.mimetype
        });
    
        // Vérifier que le teacher existe
        const teacher = await this.profileService.findById(id);
        if (!teacher) {
          throw new NotFoundException('Teacher not found');
        }
    
        // Uploader via le service teacher (qui utilise ProfileImageService)
        const result = await this.profileService.uploadProfileImage(file, id);
        
        console.log('✅ Upload teacher terminé:', result);
    
        // Construire l'URL complète pour le frontend
        const filename = file.filename;
        const fullImageUrl = `/profile-images/file/${filename}`;
    
        // Structure de réponse cohérente
        return {
          success: true,
          message: 'Profile image uploaded successfully',
          data: {
            imageUrl: result.imageUrl || `/uploads/${filename}`,
            fullImageUrl: fullImageUrl, // URL complète pour accès direct
            profileImage: result.profileImage,
            teacher: result.teacher || null
          }
        };
      } catch (error) {
        console.error('❌ Erreur upload teacher controller:', error);
        throw error;
      }
    }
}