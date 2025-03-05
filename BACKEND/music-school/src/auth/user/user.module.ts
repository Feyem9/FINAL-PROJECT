import { Module } from '@nestjs/common';
import { userProviders } from './user.providers';
import { UserController } from './user.controller';
import { DatabaseModule } from '../../database/database.module'; // Importe le module de la DB
import { TeacherModule } from '../teacher/teacher.module'; // 👈 IMPORT DU MODULE TEACHER
import { StudentModule } from '../student/student.module';

import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User , userSchema} from 'src/schema/user.schema';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [DatabaseModule , MongooseModule.forFeature([{ name: User.name, schema: userSchema }]) , TeacherModule , StudentModule , AdminModule], // Assure-toi que DatabaseModule est bien importé
  providers: [...userProviders, UserService], // Ajoute les providers
  controllers: [UserController],
  exports: [...userProviders, UserService], // Exporte pour d'autres modules si nécessaire
})
export class UserModule {}
