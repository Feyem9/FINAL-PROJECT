import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CalenderDto } from 'src/DTO/calender.dto';
import { calenderDocument  , Calender} from 'src/schema/calender.schema';

@Injectable()
export class CalenderService {
    constructor(
        @InjectModel(Calender.name) private readonly calenderModel: Model<calenderDocument>,
    ){}

        // --------------------------------
        // SECTION 1 : CRUD
        // --------------------------------    

    async createCalender(calenderDto:CalenderDto) {
        console.log('calenderDto' , calenderDto);
        
        const { title , description , start_date , end_date , audience } = calenderDto;
        console.log('calender' , { title , description , start_date , end_date , audience }); // Vérifie les données reçues du frontend

        const newCalender = new this.calenderModel({
            title,
            description,
            start_date,
            end_date,
            audience
        });
        console.log('newCalender', newCalender);

        return await newCalender.save();
    }

    async getAllCalenders() : Promise<Calender[]> {
        return await this.calenderModel.find().exec();
    }

    async getOneById(calenderId:string): Promise<Calender> {
        const calender = await this.calenderModel.findById(calenderId).exec();
        if(!calender){
            throw new NotFoundException(`calender with the id ${calenderId} not found`)
        }
        return calender;
    }

    async updateCalender(calenderId:string , calenderDto:CalenderDto): Promise<Calender> {
        const updatedCalender = await this.calenderModel.findByIdAndUpdate(calenderId , calenderDto , { new: true }).exec();
        if(!updatedCalender){
            throw new NotFoundException(`calender with the id ${calenderId} not found`)
        }
        return updatedCalender;
    }

    async deleteCalender(calenderId:string): Promise<Calender> {
        const deletedCalender = await this.calenderModel.findByIdAndDelete(calenderId).exec();
        if(!deletedCalender){
            throw new NotFoundException(`calender with the id ${calenderId} not found`)
        }
        return deletedCalender;
    }


}
