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
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mails/mail.service';
import { JwtModule } from '@nestjs/jwt';
import { CalenderController } from './calendrier/calender/calender.controller';
import { CalenderService } from './calendrier/calender/calender.service';
import { CalenderModule } from './calendrier/calender/calender.module';
import { Calender, calenderSchema } from './schema/calender.schema';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { NotificationModule } from './notification/notification/notification.module';
import { ChatModule } from './chats/chat/chat.module';
import { AnnonceController } from './annonce/annonce/annonce.controller';
import { AnnonceModule } from './annonce/annonce/annonce.module';
import { BlogController } from './music_blog/blog/blog.controller';
import { BlogModule } from './music_blog/blog/blog.module';
import { ResourceModule } from './music_resources/resource/resource.module';
import { NoteController } from './note/note/note.controller';
import { NoteService } from './note/note/note.service';
import { NoteModule } from './note/note/note.module';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, // 👈 Permet d'accéder aux variables dans tous les modules
    envFilePath: '.env', // 👈 Assure-toi que c'est bien défini
  }),
  // MongooseModule.forRoot('mongodb+srv://feyemlionel:Feyem@blog.oxy0qqt.mongodb.net/music-school'),
  MongooseModule.forRoot(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout après 5s
    connectTimeoutMS: 10000, // Timeout pour l'établissement de connexion

    retryWrites: true,
  }),
  MongooseModule.forFeature([{ name: Calender.name, schema: calenderSchema }]),
  MailerModule.forRoot({
    transport: {
      host: process.env.MAIL_HOST, // SMTP de Gmail (exemple)
      port: process.env.MAIL_PORT, // Port SMTP
      secure: false, // true pour 465, false pour d'autres
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // ⚠️ Utiliser un mot de passe d'application pour Gmail
      },
    },
    defaults: {
      from: '"Museschool" <feyemlionel@gmail.com>', // Nom et email d'expéditeur
    },
    template: {
      dir: __dirname + '/templates', // Dossier des templates (si utilisé)
      adapter: new (require('@nestjs-modules/mailer/dist/adapters/handlebars.adapter')).HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1h' },
  }),
    StudentModule,
    UserModule,
    CourseModule,
    AuthModule,
    DatabaseModule, 
    AdminModule, 
    TeacherModule, 
    StudentModule, 
    CalenderModule, 
    NotificationModule, 
    ChatModule, 
    AnnonceModule, 
    BlogModule, 
    ResourceModule, 
    NoteModule],
  controllers: [AppController, UserController, CourseController, CalenderController, AnnonceController, BlogController],
  providers: [AppService, AdminService, MailService, CalenderService, // 👉 Ajout du RolesGuard comme guard global
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },],
  exports: [MailService]
})
export class AppModule { }
