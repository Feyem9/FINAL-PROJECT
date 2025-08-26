import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Teacher, TeacherSchema } from '../../schema/teacher.schema';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService , ConfigModule} from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { RolesGuard } from 'src/roles.guard';
import { ProfileImageModule } from '../profile/profile-images/profile-image/profile-image.module';
import { ProfileImageSchema } from 'src/schema/profileImage.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema },
    { name: 'ProfileImage', schema: ProfileImageSchema }
  ],), ProfileImageModule, 
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1h' },
    }),
  }), ConfigModule,MailerModule
],
  providers: [TeacherService , RolesGuard],
  controllers: [TeacherController],
  exports: [MongooseModule , TeacherService], // 👈 EXPORTER POUR LES AUTRES MODULES
})
export class TeacherModule {}
