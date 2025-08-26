import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Patch,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherDto } from 'src/DTO/teacherDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './teacher.service';
import { Teacher } from '../../schema/teacher.schema';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles.guard';
import { TeacherGuard } from './teacher.guard';
import { LoginDto } from 'src/DTO/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Teacher') // Regroupe les endpoints sous le tag "Teacher" dans Swagger
@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) { }

  @Post('create')
  // @UseGuards(RolesGuard)  // Seul l'admin peut créer un enseignant
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiOperation({ summary: 'Create a new teacher' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Teacher creation data with optional file upload',
    schema: {
      type: 'object',
      properties: {
        speciality: { type: 'string', example: 'Piano' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Teacher created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createTeacher(
    @Body() createTeacherDto: TeacherDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const result = await this.teacherService.createTeacher(createTeacherDto, file);
    await this.teacherService.sendWelcomeEmail(result.teacher.email, result.teacher.name);
    return result;
  }

  // @UseGuards(TeacherGuard)
  @Get('/all')
  @ApiOperation({ summary: 'Get all teachers' })
  @ApiResponse({ status: 200, description: 'List of all teachers' })
  async findAll() {
    return this.teacherService.findAll();
  }

  // @UseGuards(TeacherGuard)  // L'enseignant peut accéder à son propre profil
  @Get(':id')
  @ApiOperation({ summary: 'Get a teacher by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the teacher', example: '64b7f3c2e4b0f5a1d2c3e4f5' })
  @ApiResponse({ status: 200, description: 'Teacher details' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  async findById(@Param('id') id: string) {
    const teacher = await this.teacherService.findById(id);
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  // @UseGuards(RolesGuard)  // Seul l'admin peut mettre à jour un enseignant
  @Put(':id')
  @ApiOperation({ summary: 'Update a teacher by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the teacher', example: '64b7f3c2e4b0f5a1d2c3e4f5' })
  @ApiResponse({ status: 200, description: 'Teacher updated successfully' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  async updateTeacher(@Param('id') id: string, @Body() updateTeacherDto: Partial<TeacherDto>) {
    return this.teacherService.updateTeacher(id, updateTeacherDto);
  }

  // @UseGuards(RolesGuard)  // Seul l'admin peut supprimer un enseignant
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a teacher by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the teacher', example: '64b7f3c2e4b0f5a1d2c3e4f5' })
  @ApiResponse({ status: 200, description: 'Teacher deleted successfully' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  async deleteTeacher(@Param('id') id: string) {
    const teacher = await this.teacherService.findById(id);
    if (!teacher) throw new NotFoundException('Teacher not found');
    await this.teacherService.sendDeletionEmail(teacher.email, teacher.name);
    return this.teacherService.deleteTeacher(id);
  }

  @Patch(':id/verify')
  @UseGuards(RolesGuard)  // Seul l'admin peut vérifier un enseignant
  @ApiOperation({ summary: 'Verify a teacher by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'The ID of the teacher', example: '64b7f3c2e4b0f5a1d2c3e4f5' })
  @ApiResponse({ status: 200, description: 'Teacher verified successfully' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  async verifyTeacher(@Param('id') id: string, @Body('isVerified') isVerified: boolean): Promise<Teacher> {
    const teacher = await this.teacherService.verifyTeacher(id, isVerified);
    await this.teacherService.sendVerificationEmail(teacher.email, teacher.name);
    return teacher;
  }

  @Post('/register')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiOperation({ summary: 'Register a new teacher' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Teacher registration data with optional file upload',
    schema: {
      type: 'object',
      properties: {
        speciality: { type: 'string', example: 'Piano' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Teacher registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async signUpTeacher(
    @Body() teacherDto: TeacherDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<{ teacher: any }> {
    const result = await this.teacherService.signUpTeacher(teacherDto, file);
    await this.teacherService.sendWelcomeEmail(result.teacher.email, result.teacher.name);
    return result;
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login as a teacher' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  async loginTeacher(@Body() loginDto: LoginDto): Promise<{ token: string; teacher: any }> {
    const result = await this.teacherService.loginTeacher(loginDto);
    if (!result.teacher) {
      throw new NotFoundException('Teacher not found');
    }
    return result;
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

    return await this.teacherService.getUserLocationByGPS(lat, lon);
  }


// Dans votre TeacherController, mettez à jour la méthode uploadProfileImage:

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
    const teacher = await this.teacherService.findById(id);
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    // Uploader via le service teacher (qui utilise ProfileImageService)
    const result = await this.teacherService.uploadProfileImage(file, id);
    
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