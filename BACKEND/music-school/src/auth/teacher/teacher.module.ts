import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Teacher, TeacherSchema } from '../../schema/teacher.schema';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }])],
  providers: [TeacherService],
  controllers: [TeacherController],
  exports: [MongooseModule , TeacherService], // 👈 EXPORTER POUR LES AUTRES MODULES
})
export class TeacherModule {}
