// import { Module } from '@nestjs/common';
// import { CourseService } from './course.service';
// import { CourseController } from './course.controller';

// @Module({
//   imports : [CourseModule],
//   controllers: [CourseController],
//   exports: [CourseService],
//   providers: [CourseService]
// })
// export class CourseModule {}
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course, courseSchema } from '../../schema/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: courseSchema }])
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService], // Permet d'exporter CourseService si besoin
})
export class CourseModule {}
