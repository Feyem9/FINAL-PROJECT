import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { ProfileService } from './profile.service';
import { Roles } from '../../role/role.decorator';
import { Role } from '../../role/role.enum';
import { RolesGuard } from '../../role/role.guard';

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

    @Post('upload-image/:userId')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
    @UseInterceptors(FileInterceptor('image', multerOptions))
    async uploadProfileImage(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Req() req: any,
    ) {
        // Check if user is updating their own profile or admin updating any profile
        const user = req.user;
        if (user.role !== 'admin' && user.sub !== userId) {
            throw new Error('Access denied: you can only update your own profile');
        }

        if (!file) {
            throw new Error('No file provided');
        }

        const imagePath = `/uploads/${file.filename}`;
        const updatedUser = await this.profileService.updateProfileImage(
            userId,
            user.role,
            imagePath,
        );

        return {
            message: 'Profile image uploaded successfully',
            imagePath: imagePath,
            user: updatedUser,
        };
    }
}