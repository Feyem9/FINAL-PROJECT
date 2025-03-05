import { Body, Controller, Post, Put, Get, Delete, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CourseService } from './course.service';
import { CourseDto } from 'src/DTO/course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('/create')
  async createCourse(@Body() courseDto: CourseDto) : Promise<CourseDto> {
    console.log("Received request body:", courseDto); // 🔍 Vérifie ici aussi !
    return await this.courseService.createCourse(courseDto);
  }

  @Get('/all')
  async getAllCourses() {
    return await this.courseService.getAllCourses();
  }

  @Get('/get/:courseId')
  async getCourseById(@Param('courseId') courseId: string) {
    return await this.courseService.getCourseById(courseId);
  }

  @Put('/update/:courseId')
  async updateCourse(@Param('courseId') courseId: string, @Body() courseDto: CourseDto) {
    return await this.courseService.updateCourse(courseId, courseDto);
  }

  @Delete('/delete/:courseId')
  async deleteCourse(@Param('courseId') courseId: string) {
    return await this.courseService.deleteCourse(courseId);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCourseMedia(@UploadedFile() file: Express.Multer.File) {
    const filePath = await this.courseService.uploadMedia(file);
    return {
      message: 'File uploaded successfully',
      filePath,
    };
  }
}