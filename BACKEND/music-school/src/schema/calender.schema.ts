import { Prop, SchemaFactory , Schema} from "@nestjs/mongoose";
import { HydratedDocument,  } from "mongoose";
import { Document } from "mongoose";
import { timeStamp } from "console";

export type calenderDocument = HydratedDocument<Calender>;


@Schema({ timestamps:true }) 
export class Calender extends Document{
@Prop({required:true})
title:string;

@Prop({required:true})
description:string;

@Prop({required:true})
start_date:Date;

@Prop({required:true})
end_date:Date;

@Prop({required:true , enum : ['teacher' , 'student' , 'teacher_and_student'] })
audience: 'teacher' | 'student' | 'teacher_and_student';

}

export const calenderSchema = SchemaFactory.createForClass(Calender);