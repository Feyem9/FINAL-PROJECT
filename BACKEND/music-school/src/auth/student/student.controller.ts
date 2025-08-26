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
  Req,
  ForbiddenException,
  BadRequestException,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { Request } from 'express';
import { StudentService } from './student.service';
import { StudentDto } from 'src/DTO/studentDto';
import { LoginDto } from 'src/DTO/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { StudentGuard } from './student.guard';
import { AdminGuard } from '../admin/admin.guard';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { Course } from 'src/schema/course.schema';
import { CourseService, multerOptions } from 'src/courses/course/course.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Student')
@Controller('students')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly courseService: CourseService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {
    interface User {
      sub: string;    // Identifiant de l'utilisateur
      role: string;   // Le rôle de l'utilisateur
      // Autres propriétés de l'utilisateur
    }

  }


  // ✅ Accessible uniquement à l’admin
  @Post('create')
  // @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a new student (Admin only)' })
  @ApiResponse({ status: 201, description: 'Student created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createStudent(@Body() createStudentDto: StudentDto) {
    const { student, token } = await this.studentService.createStudent(createStudentDto);
    await this.studentService.sendWelcomeEmail(student.email, student.name);
    return { student, token, message: 'Student created successfully. Welcome email sent!' };
  }

  // ✅ Admin only
  // @UseGuards(AdminGuard)
  @Get('/all')
  @ApiOperation({ summary: 'Get all students (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all students' })
  async findAll() {
    return this.studentService.findAll();
  }

  // ✅ Étudiant ou Admin peut voir le profil — sécurité renforcée
  // @UseGuards(StudentGuard) 
  @Get(':id')
  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Student details' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async findById(@Param('id') id: string, @Req() req: Request) {
    console.log('ID reçu depuis la route :', id); // <== Ajoute ceci

    const user = req['user'];

    const student = await this.studentService.findById(id);
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  // ✅ Admin only
  // @UseGuards(AdminGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a student by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Student updated successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async updateStudent(@Param('id') id: string, @Body() updateStudentDto: Partial<StudentDto>) {
    return this.studentService.updateStudent(id, updateStudentDto);
  }

  // ✅ Admin only
  // @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Student deleted successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async deleteStudent(@Param('id') id: string) {
    const student = await this.studentService.findById(id);
    if (!student) throw new NotFoundException('Student not found');
    await this.studentService.sendDeletionEmail(student.email, student.name);
    await this.studentService.deleteStudent(id);
    return { message: 'Student deleted successfully. Deletion email sent!' };
  }

  // ✅ Accessible sans auth
  @Post('/register')
  @ApiOperation({ summary: 'Register a new student' })
  @ApiResponse({ status: 201, description: 'Student registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async signUpStudent(@Body() studentDto: StudentDto): Promise<{ student: any }> {
    return await this.studentService.signUpStudent(studentDto);
  }

  // ✅ Accessible sans auth
  @Post('/login')
  @ApiOperation({ summary: 'Login as a student' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async loginStudent(@Body() loginDto: LoginDto): Promise<{ token: string; student: any }> {
    const result = await this.studentService.loginStudent(loginDto);
    if (!result.student) {
      throw new NotFoundException('Student not found');
    }
    return result;
  }

  // @Post('/profile-image')
  // @ApiOperation({ summary: 'Update student profile image' })
  // @ApiResponse({ status: 200, description: 'Profile image updated successfully' })
  // @ApiResponse({ status: 404, description: 'Student not found' })
  // async updateProfileImage(
  //   @Body('imagePath') imagePath: string,
  // ): Promise<any> {
  //   const user = Req['user'];
  //   if (user.role !== 'student') {
  //     throw new ForbiddenException('Only students can update their profile image');
  //   }
  //   return this.studentService.updateStudentProfileImage(
  //     user.sub, // Utilise l'ID de l'utilisateur authentifié
  //     imagePath,
  //   );
  // }

  @Get('/:id/enrolled-courses')
  @ApiOperation({ summary: 'Get enrolled courses for a student' })
  @ApiResponse({ status: 200, description: 'List of enrolled courses' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getEnrolledCourses(@Param('id') id: string): Promise<Course[]> {
    return this.studentService.getEnrolledCourses(id);
  }

  @Post('/enroll-course/:studentId/:courseId')
  @ApiOperation({ summary: 'Enroll a student in a course' })
  @ApiResponse({ status: 200, description: 'Enrollment successful' })
  @ApiResponse({ status: 404, description: 'Student or course not found' })
  @ApiResponse({ status: 400, description: 'Student already enrolled' })
  async enrollInCourse(
    @Param('studentId') studentId: string,
    @Param('courseId') courseId: string,
  ): Promise<{ success: boolean; message: string; enrolledCourses: Course[] }> {
    try {
      const student = await this.studentService.findById(studentId);
      if (!student) {
        throw new NotFoundException('Student not found');
      }

      const course = await this.courseService.getCourseById(courseId);
      if (!course) {
        throw new NotFoundException('Course not found');
      }

      const enrolledCourses = await this.studentService.enrollInCourse(studentId, courseId);

      return {
        success: true,
        message: 'Enrollment successful',
        enrolledCourses
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
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

    return await this.studentService.getUserLocationByGPS(lat, lon);
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
    const teacher = await this.studentService.findById(id);
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    // Uploader via le service teacher (qui utilise ProfileImageService)
    const result = await this.studentService.uploadProfileImage(file, id);
    
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


