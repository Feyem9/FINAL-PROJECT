import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseDto } from '../../DTO/course.dto';
import { Course, courseDocument } from '../../schema/course.schema';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { HttpService } from '@nestjs/axios';
import { User } from 'src/schema/user.schema';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<courseDocument>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Teacher') private readonly teacherModel: Model<User>, // Assurez-vous que le modèle Teacher est correctement importé
    @InjectModel('Admin') private readonly adminModel: Model<User>, // Assurez-vous que le modèle Admin est correctement importé
    private readonly httpService: HttpService
  ) { }

  async createCourse(
    courseDto: CourseDto,
    mediaFile?: Express.Multer.File,
    imageFile?: Express.Multer.File,
  ): Promise<Course> {
    const { title, description, amount, category, level, user_id, role } = courseDto;

    // Vérifier que l'user existe
    const user = await this.getUserByRole(user_id, role);
    console.log('user is', user);

    if (!user) throw new BadRequestException('Utilisateur inexistant.');


    // Vérifier son rôle
    if (role !== 'teacher' && role !== 'admin') {
      throw new ForbiddenException('Seuls les enseignants ou administrateurs peuvent créer un cours.');
    }

    // Préparation des fichiers
    const fileUrl = mediaFile ? `/uploads/${mediaFile.filename}` : undefined;
    const image = imageFile ? `/uploads/${imageFile.filename}` : undefined;

    // Création du nouveau cours
    const newCourse = new this.courseModel({
      title,
      description,
      amount,
      category,
      level,
      media: courseDto.media,
      user_id,
      role,
      image,
      fileUrl,
    });

    return newCourse.save();
  }


  async getUserByRole(user_id: string, role: 'teacher' | 'admin') {
    let user;
    // Vérifie le rôle et récupère l'utilisateur approprié
    if (role === 'teacher') {
      user = await this.teacherModel.findById(user_id).exec();
      console.log('user is 1', user);
    } else if (role === 'admin') {
      user = await this.adminModel.findById(user_id).exec();
      console.log('user is 2', user);
    }

    return user;
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

  async updateCourse(
    courseId: string,
    courseDto: CourseDto,
    mediaFile?: Express.Multer.File,
    imageFile?: Express.Multer.File,
  ): Promise<Course> {
    const updateData: any = {
      ...courseDto,
    };

    if (mediaFile) updateData.media = `/uploads/${mediaFile.filename}`;
    if (imageFile) updateData.image = `/uploads/${imageFile.filename}`;

    const updatedCourse = await this.courseModel.findByIdAndUpdate(courseId, updateData, { new: true }).exec();
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

  async getYoutubeVideos(query: string) {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    console.log(`Using YouTube API Key: ${API_KEY}`);

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=27&q=${encodeURIComponent(query)}&key=${API_KEY}&maxResults=10`;
    console.log(`YouTube API URL: ${url}`);


    try {
      const response = await this.httpService.axiosRef.get(url);
      console.log(`YouTube API Response: ${JSON.stringify(response.data.items)}`);

      return response.data.items.map(item => ({
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.default.url,
        videoId: item.id.videoId
      }));

    } catch (error) {
      throw new Error('Erreur lors de la récupération des vidéos YouTube');
    }
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
