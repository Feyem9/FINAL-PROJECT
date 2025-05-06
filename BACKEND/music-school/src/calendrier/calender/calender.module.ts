import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Calender, calenderSchema } from 'src/schema/calender.schema';
import { CalenderController } from './calender.controller';
import { CalenderService } from './calender.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Calender.name, schema: calenderSchema }])
      ],
    controllers:[CalenderController],
    providers:[CalenderService],
    exports:[CalenderService]
})
export class CalenderModule {}
