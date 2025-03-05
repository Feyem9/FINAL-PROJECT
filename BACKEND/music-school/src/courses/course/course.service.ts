import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseDto } from '../../DTO/course.dto';
import { Course, courseDocument } from '../../schema/course.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<courseDocument>,
  ) {}

  async createCourse(courseDto: CourseDto): Promise<Course> {
    console.log('corseDto' , courseDto);

    const {title , description , amount , level , media , teacher_id} = courseDto
    console.log('Received courseDto:', {title , description , amount , level , media , teacher_id}); // Vérifie les données reçues du frontend

    const newCourse = new this.courseModel({title , description , amount , level , media , teacher_id});
    console.log('newCourse', newCourse);
    return newCourse.save();
  }

  async getAllCourses(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  async getCourseById(courseId: string): Promise<Course> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    return course;
  }

  async updateCourse(courseId: string, courseDto: CourseDto): Promise<Course> {
    const updatedCourse = await this.courseModel.findByIdAndUpdate(courseId, courseDto, { new: true }).exec();
    if (!updatedCourse) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    return updatedCourse;
  }

  async deleteCourse(courseId: string): Promise<Course> {
    const deletedCourse = await this.courseModel.findByIdAndDelete(courseId).exec();
    if (!deletedCourse) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    return deletedCourse;
  }

  async uploadMedia(file: Express.Multer.File): Promise<{ filename: string; path: string }> {
    if (!file) {
      throw new NotFoundException('No file provided');
    }
    return {
      filename: file.filename,
      path: `/uploads/${file.filename}`,
    };
  }
}

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = uuidv4() + path.extname(file.originalname);
      callback(null, uniqueSuffix);
    },
  }),
};
