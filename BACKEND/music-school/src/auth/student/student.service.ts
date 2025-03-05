import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from '../../schema/student.schema';
import { UserDto } from '../../DTO/userDto';

@Injectable()
export class StudentService {
  constructor(@InjectModel(Student.name) private studentModel: Model<StudentDocument>) {}

  async createStudent(createStudentDto: UserDto): Promise<Student> {
    const newStudent = new this.studentModel(createStudentDto);
    return newStudent.save();
  }

  async findAll(): Promise<Student[]> {
    return this.studentModel.find().exec();
  }

  async findById(id: string): Promise<Student> {
    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  async updateStudent(id: string, updateStudentDto: Partial<UserDto>): Promise<Student> {
    const updatedStudent = await this.studentModel.findByIdAndUpdate(id, updateStudentDto, {
      new: true,
    }).exec();
    if (!updatedStudent) {
      throw new NotFoundException('Student not found');
    }
    return updatedStudent;
  }

  async deleteStudent(id: string): Promise<void> {
    const result = await this.studentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Student not found');
    }
  }
}
