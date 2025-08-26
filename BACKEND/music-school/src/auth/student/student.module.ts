import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from '../../schema/student.schema';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuard } from '../../role/role.guard';
import { ProfileModule } from '../profile/profile.module';
import { Course, courseSchema } from 'src/schema/course.schema';
import { CourseModule } from 'src/courses/course/course.module';
import { ProfileImage, ProfileImageSchema } from 'src/schema/profileImage.schema';
import { ProfileImageModule } from '../profile/profile-images/profile-image/profile-image.module';


@Module({
  imports: [ProfileModule,CourseModule,ProfileImageModule,
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([{ name: Course.name, schema: courseSchema }]),
    MongooseModule.forFeature([{ name: ProfileImage.name, schema: ProfileImageSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    MailerModule,
    ConfigModule,
  ],
  controllers: [StudentController],
  providers: [StudentService, RolesGuard],
  exports: [MongooseModule, StudentService], // 👈 EXPORTER POUR LES AUTRES MODULES
})
export class StudentModule { }
