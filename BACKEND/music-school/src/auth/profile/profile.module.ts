import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../../schema/admin.schema';
import { Teacher, TeacherSchema } from '../../schema/teacher.schema';
import { Student, StudentSchema } from '../../schema/student.schema';
import { AuthModule } from '../auth/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([
        { name: Admin.name, schema: AdminSchema },
        { name: Teacher.name, schema: TeacherSchema },
        { name: Student.name, schema: StudentSchema },
    ]),

    ],
    controllers: [ProfileController],
    providers: [ProfileService],
    exports: [ProfileService],
})
export class ProfileModule { }