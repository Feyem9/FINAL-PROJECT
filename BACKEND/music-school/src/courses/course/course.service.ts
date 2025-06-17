import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseDto } from '../../DTO/course.dto';
import { Course, courseDocument } from '../../schema/course.schema';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<courseDocument>,
  ) { }

  async createCourse(courseDto: CourseDto, file?: Express.Multer.File): Promise<Course> {
    const { title, description, amount, category, level, media, teacher_id, image } = courseDto;
    const fileUrl = file ? `/uploads/${file.filename}` : undefined;
    const newCourse = new this.courseModel({
      title,
      description,
      amount,
      category,
      level,
      media,
      teacher_id,
      image,
      fileUrl,
    });
    return newCourse.save();
  }

  async getAllCourses(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  // Ajoute cette méthode pour récupérer tous les cours d'un enseignant
  async getCoursesByTeacher(teacherId: string): Promise<Course[]> {
    return this.courseModel.find({ teacher_id: teacherId }).exec();
  }

  async getCourseById(courseId: string): Promise<Course> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    return course;
  }

  async getCoursesByCategory(category: string): Promise<Course[]> {
    const courses = await this.courseModel.find({ category }).exec();
    if (!courses || courses.length === 0) {
      throw new NotFoundException(`No courses found for category: ${category}`);
    }
    return courses;
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
    // Supprimer le fichier média associé si présent
    if (deletedCourse.fileUrl) {
      const filePath = path.join(process.cwd(), deletedCourse.fileUrl);
      fs.unlink(filePath, (err) => {
        if (err) {
          // Log l'erreur mais ne bloque pas la suppression du cours
          console.error('Erreur lors de la suppression du fichier:', err);
        }
      });
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
