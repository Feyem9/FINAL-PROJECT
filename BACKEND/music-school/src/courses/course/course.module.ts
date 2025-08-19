import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course, courseSchema } from '../../schema/course.schema';
import { User, userSchema } from 'src/schema/user.schema';

@Module({
  imports: [HttpModule,
    MongooseModule.forFeature([{ name: Course.name, schema: courseSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    MongooseModule.forFeature([{ name: 'Admin', schema: userSchema }]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService], // Permet d'exporter CourseService si besoin
})
export class CourseModule { }
