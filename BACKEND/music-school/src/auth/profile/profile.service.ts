import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../../schema/admin.schema';
import { Teacher } from '../../schema/teacher.schema';
import { Student } from '../../schema/student.schema';

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(Admin.name) private adminModel: Model<Admin>,
        @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
        @InjectModel(Student.name) private studentModel: Model<Student>,
    ) { }

    async updateProfileImage(
        userId: string,
        role: 'admin' | 'teacher' | 'student',
        imagePath: string,
    ): Promise<any> {
        switch (role) {
            case 'admin':
                return await this.updateAdminImage(userId, imagePath);
            case 'teacher':
                return await this.updateTeacherImage(userId, imagePath);
            case 'student':
                return await this.updateStudentImage(userId, imagePath);
            default:
                throw new NotFoundException('Invalid user role');
        }
    }

    private async updateAdminImage(userId: string, imagePath: string) {
        const admin = await this.adminModel.findByIdAndUpdate(
            userId,
            { image: imagePath },
            { new: true },
        );
        if (!admin) {
            throw new NotFoundException('Admin not found');
        }
        return admin;
    }

    private async updateTeacherImage(userId: string, imagePath: string) {
        const teacher = await this.teacherModel.findByIdAndUpdate(
            userId,
            { image: imagePath },
            { new: true },
        );
        if (!teacher) {
            throw new NotFoundException('Teacher not found');
        }
        return teacher;
    }

    private async updateStudentImage(userId: string, imagePath: string) {
        const student = await this.studentModel.findByIdAndUpdate(
            userId,
            { image: imagePath },
            { new: true },
        );
        if (!student) {
            throw new NotFoundException('Student not found');
        }
        return student;
    }
}