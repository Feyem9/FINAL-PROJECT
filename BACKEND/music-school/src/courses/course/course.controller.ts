import {
  Body,
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Param,
  UploadedFile,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CourseService } from './course.service';
import { CourseDto } from 'src/DTO/course.dto';
import { multerOptions } from './course.service'; // adapte le chemin si besoin
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @Post('/create')
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully', type: CourseDto })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiConsumes('multipart/form-data')
  async createCourse(
    @Body() courseDto: CourseDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    // Passe bien le fichier au service
    return await this.courseService.createCourse(courseDto, file);
  }

  @Get('/all')
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({ status: 200, description: 'List of all courses' })
  async getAllCourses() {
    return await this.courseService.getAllCourses();
  }

  @Get('/teacher/:teacherId')
  @ApiOperation({ summary: 'Get all courses for a teacher' })
  @ApiParam({ name: 'teacherId', description: 'The ID of the teacher' })
  @ApiResponse({ status: 200, description: 'List of courses for the teacher' })
  async getCoursesByTeacher(@Param('teacherId') teacherId: string) {
    return await this.courseService.getCoursesByTeacher(teacherId);
  }

  @Get('/get/:courseId')
  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiParam({ name: 'courseId', description: 'The ID of the course', example: '64b7f3c2e4b0f5a1d2c3e4f5' })
  @ApiResponse({ status: 200, description: 'Course details' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async getCourseById(@Param('courseId') courseId: string) {
    return await this.courseService.getCourseById(courseId);
  }

  @Get('/category/:category')
  @ApiOperation({ summary: 'Get courses by category' })
  @ApiParam({ name: 'category', description: 'The category of the courses', example: 'piano' })
  @ApiResponse({ status: 200, description: 'List of courses in the specified category' })
  @ApiResponse({ status: 404, description: 'No courses found for the specified category' })
  async getCoursesByCategory(@Param('category') category: string) {
    return await this.courseService.getCoursesByCategory(category);
  }

  @Put('/update/:courseId')
  @ApiOperation({ summary: 'Update a course by ID' })
  @ApiParam({ name: 'courseId', description: 'The ID of the course', example: '64b7f3c2e4b0f5a1d2c3e4f5' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async updateCourse(@Param('courseId') courseId: string, @Body() courseDto: CourseDto) {
    return await this.courseService.updateCourse(courseId, courseDto);
  }

  @Delete('/delete/:courseId')
  @ApiOperation({ summary: 'Delete a course by ID' })
  @ApiParam({ name: 'courseId', description: 'The ID of the course', example: '64b7f3c2e4b0f5a1d2c3e4f5' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async deleteCourse(@Param('courseId') courseId: string) {
    return await this.courseService.deleteCourse(courseId);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload course media' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a media file for the course',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file upload' })
  async uploadCourseMedia(@UploadedFile() file: Express.Multer.File) {
    const filePath = await this.courseService.uploadMedia(file);
    return {
      message: 'File uploaded successfully',
      filePath,
    };
  }

  /**
   * Search YouTube videos based on a query
   * @param query Search query
   * @returns List of YouTube videos matching the search query
   */
  @Get('/search-youtube')
  @ApiOperation({ summary: 'Search YouTube videos' })
  @ApiResponse({ status: 200, description: 'List of YouTube videos matching the search query' })
  @ApiResponse({ status: 400, description: 'Invalid search query' })
  @ApiParam({ name: 'query', description: 'Search query for YouTube videos', example: 'piano tutorial' })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiConsumes('multipart/form-data')

  async searchYoutubeVideos(@Query('q') query: string) {
    return this.courseService.getYoutubeVideos(query);
  }


}