import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './auth/user/user.controller';
import { UserModule } from './auth/user/user.module';
import { CourseController } from './courses/course/course.controller';
import { CourseModule } from './courses/course/course.module';
import { AuthModule } from './auth/auth/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AdminService } from './auth/admin/admin.service';
import { AdminModule } from './auth/admin/admin.module';
import { TeacherModule } from './auth/teacher/teacher.module';
import { StudentModule } from './auth/student/student.module';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, // 👈 Permet d'accéder aux variables dans tous les modules
    envFilePath: '.env', // 👈 Assure-toi que c'est bien défini
  }), MongooseModule.forRoot('mongodb+srv://feyemlionel:Feyem@blog.oxy0qqt.mongodb.net/music-school'),
    UserModule, CourseModule, AuthModule, DatabaseModule, AdminModule, TeacherModule, StudentModule],
  controllers: [AppController, UserController, CourseController],
  providers: [AppService , AdminService],
})
export class AppModule { }
