import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Calender, calenderSchema } from 'src/schema/calender.schema';
import { CalenderController } from './calender.controller';
import { CalenderService } from './calender.service';
import { NotificationModule } from 'src/notification/notification/notification.module';
import { StudentModule } from 'src/auth/student/student.module';
import { TeacherModule } from 'src/auth/teacher/teacher.module';
import { AdminModule } from 'src/auth/admin/admin.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Calender.name, schema: calenderSchema }]),
    forwardRef(() => NotificationModule),
    StudentModule,
    TeacherModule,
    AdminModule
  ],
  controllers: [CalenderController],
  providers: [CalenderService],
  exports: [CalenderService]
})
export class CalenderModule {}
