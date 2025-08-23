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


@Module({
  imports: [ProfileModule,CourseModule,
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([{ name: Course.name, schema: courseSchema }]),
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
