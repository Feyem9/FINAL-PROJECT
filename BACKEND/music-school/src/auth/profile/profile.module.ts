import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../../schema/admin.schema';
import { Teacher, TeacherSchema } from '../../schema/teacher.schema';
import { Student, StudentSchema } from '../../schema/student.schema';
import { AuthModule } from '../auth/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ProfileImageController } from './profile-images/profile-image/profile-image.controller';
import { ProfileImageService } from './profile-images/profile-image/profile-image.service';
import { ProfileImageSchema } from 'src/schema/profileImage.schema';

@Module({
    imports: [JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([
        { name: Admin.name, schema: AdminSchema },
        { name: Teacher.name, schema: TeacherSchema },
        { name: Student.name, schema: StudentSchema },
        { name: 'ProfileImage', schema: ProfileImageSchema }
    ]),

    ],
    controllers: [ProfileController, ProfileImageController],
    providers: [ProfileService, ProfileImageService],
    exports: [ProfileService],
})
export class ProfileModule { }