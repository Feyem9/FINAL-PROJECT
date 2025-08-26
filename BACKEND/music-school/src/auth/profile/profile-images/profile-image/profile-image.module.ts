import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileImage, ProfileImageSchema } from '../../../../schema/profileImage.schema';
import { ProfileImageController } from './profile-image.controller';
import { ProfileImageService } from './profile-image.service';
import { TeacherSchema } from 'src/schema/teacher.schema';
import { StudentSchema } from 'src/schema/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ProfileImage.name, schema: ProfileImageSchema },
        { name: 'ProfileImage', schema: ProfileImageSchema },
        { name: 'teacher', schema: TeacherSchema },
        {name: 'student', schema: StudentSchema}
    ]),
  ],
  controllers: [ProfileImageController],
  providers: [ProfileImageService],
  exports: [ProfileImageService],
})
export class ProfileImageModule {}
