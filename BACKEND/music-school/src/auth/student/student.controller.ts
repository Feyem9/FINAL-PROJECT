// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Delete,
//   Body,
//   Param,
//   NotFoundException,
//   UseGuards,
// } from '@nestjs/common';
// import { StudentService } from './student.service';
// import { StudentDto } from 'src/DTO/studentDto';
// import { LoginDto } from 'src/DTO/login.dto';
// import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
// import { StudentGuard } from './student.guard';
// import { MailerService } from '@nestjs-modules/mailer';
// import { JwtService } from '@nestjs/jwt';

// @ApiTags('Student') // Regroupe les endpoints sous le tag "Student" dans Swagger
// @Controller('students')
// export class StudentController {
//   constructor(
//     private readonly studentService: StudentService,
//     private readonly mailerService: MailerService,
//     private readonly jwtService: JwtService,
//   ) { }

//   @Post('create')
//   @ApiOperation({ summary: 'Create a new student' })
//   @ApiResponse({ status: 201, description: 'Student created successfully' })
//   @ApiResponse({ status: 400, description: 'Invalid input data' })
//   async createStudent(@Body() createStudentDto: StudentDto) {
//     const { student, token } = await this.studentService.createStudent(createStudentDto);

//     // 📧 Envoyer un email de bienvenue 
//     await this.studentService.sendWelcomeEmail(student.email, student.name);

//     return { student, token, message: 'Student created successfully. Welcome email sent!' };
//   }

//   @UseGuards(StudentGuard)
//   @Get('/all') 
//   @ApiOperation({ summary: 'Get all students' })
//   @ApiResponse({ status: 200, description: 'List of all students' })
//   async findAll() {
//     return this.studentService.findAll();
//   }

//   @UseGuards(StudentGuard)
//   @Get(':id')
//   @ApiOperation({ summary: 'Get a student by ID' })
//   @ApiParam({ name: 'id', description: 'The ID of the student', example: '64b7f3c2e4b0f5a1d2c3e4f5' })
//   @ApiResponse({ status: 200, description: 'Student details' })
//   @ApiResponse({ status: 404, description: 'Student not found' })
//   async findById(@Param('id') id: string) {
//     const student = await this.studentService.findById(id);
//     if (!student) throw new NotFoundException('Student not found');
//     return student;
//   }

//   @UseGuards(StudentGuard)
//   @Put(':id')
//   @ApiOperation({ summary: 'Update a student by ID' })
//   @ApiParam({ name: 'id', description: 'The ID of the student', example: '64b7f3c2e4b0f5a1d2c3e4f5' })
//   @ApiResponse({ status: 200, description: 'Student updated successfully' })
//   @ApiResponse({ status: 404, description: 'Student not found' })
//   async updateStudent(@Param('id') id: string, @Body() updateStudentDto: Partial<StudentDto>) {
//     return this.studentService.updateStudent(id, updateStudentDto);
//   }

//   @UseGuards(StudentGuard)
//   @Delete(':id')
//   @ApiOperation({ summary: 'Delete a student by ID' })
//   @ApiParam({ name: 'id', description: 'The ID of the student', example: '64b7f3c2e4b0f5a1d2c3e4f5' })
//   @ApiResponse({ status: 200, description: 'Student deleted successfully' })
//   @ApiResponse({ status: 404, description: 'Student not found' })
//   async deleteStudent(@Param('id') id: string) {
//     const student = await this.studentService.findById(id);
//     if (!student) throw new NotFoundException('Student not found');

//     // 📧 Envoyer un email avant suppression
//     await this.studentService.sendDeletionEmail(student.email, student.name);

//     await this.studentService.deleteStudent(id);
//     return { message: 'Student deleted successfully. Deletion email sent!' };
//   }

//   @Post('/register')
//   @ApiOperation({ summary: 'Register a new student' })
//   @ApiResponse({ status: 201, description: 'Student registered successfully' })
//   @ApiResponse({ status: 400, description: 'Invalid input data' })
//   async signUpStudent(@Body() studentDto: StudentDto): Promise<{ student: any }> {
//     return await this.studentService.signUpStudent(studentDto);
//   }

//   @Post('/login')
//   @ApiOperation({ summary: 'Login as a student' })
//   @ApiResponse({ status: 200, description: 'Login successful' })
//   @ApiResponse({ status: 404, description: 'Student not found' })
//   async loginStudent(@Body() loginDto: LoginDto): Promise<{ token: string; student: any }> {
//     const result = await this.studentService.loginStudent(loginDto);
//     if (!result.student) {
//       throw new NotFoundException('Student not found');
//     }
//     return result;
//   }
// }
// // 
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
  ForbiddenException
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

@ApiTags('Student')
@Controller('students')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
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

    // Si student, il ne peut voir que son propre profil
    // if (user.role === 'student' && user.sub !== id) {
    //   throw new ForbiddenException('Access denied: you can only access your own profile');
    // }

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
}
