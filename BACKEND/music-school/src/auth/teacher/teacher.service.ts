import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher, TeacherDocument } from '../../schema/teacher.schema';
import { UserDto } from '../../DTO/userDto';

@Injectable()
export class TeacherService {
  constructor(@InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>) {}

  async createTeacher(createTeacherDto: UserDto): Promise<Teacher> {
    const newTeacher = new this.teacherModel(createTeacherDto);
    return newTeacher.save();
  }

  async findAll(): Promise<Teacher[]> {
    return this.teacherModel.find().exec();
  }

  async findById(id: string): Promise<Teacher> {
    const teacher = await this.teacherModel.findById(id).exec();
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    return teacher;
  }

  async updateTeacher(id: string, updateTeacherDto: Partial<UserDto>): Promise<Teacher> {
    const updatedTeacher = await this.teacherModel.findByIdAndUpdate(id, updateTeacherDto, {
      new: true,
    }).exec();
    if (!updatedTeacher) {
      throw new NotFoundException('Teacher not found');
    }
    return updatedTeacher;
  }

  async deleteTeacher(id: string): Promise<void> {
    const result = await this.teacherModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Teacher not found');
    }
  }
}
