import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminService } from 'src/auth/admin/admin.service';
import { StudentService } from 'src/auth/student/student.service';
import { TeacherService } from 'src/auth/teacher/teacher.service';
import { CalenderDto } from 'src/DTO/calender.dto';
import { NotificationService } from 'src/notification/notification/notification.service';
import { calenderDocument  , Calender} from 'src/schema/calender.schema';

@Injectable()
export class CalenderService {
    constructor(
        @InjectModel(Calender.name) private readonly calenderModel: Model<calenderDocument>,
        private readonly notificationService: NotificationService, // Assurez-vous d'importer le service de notification si nécessaire
        private readonly studentService: StudentService,
        private readonly teacherService : TeacherService,
        private readonly adminService: AdminService
    ){}

        // --------------------------------
        // SECTION 1 : CRUD
        // --------------------------------    

    async createCalender(calenderDto: CalenderDto) {
        const { title, description, start_date, end_date, audience, creator } = calenderDto;

        const newCalender = new this.calenderModel({
            title,
            description,
            start_date,
            end_date,
            audience,
            creator
        });

        const savedCalender = await newCalender.save();

        // Récupérer les IDs des utilisateurs concernés
        let userIds: string[] = [];

        if (audience === 'student') {
            // Supposons que findAll() retourne un tableau d'objets étudiants
            const students = await this.studentService.findAll();
            userIds = students.map(s => s._id?.toString());
        } else if (audience === 'teacher_and_student') {
            // À adapter selon ta logique réelle
            const students = await this.studentService.findAll();
            const teachers = await this.teacherService.findAll();
            userIds = [
                ...students.map(s => s._id?.toString()),
                ...teachers.map(t => t._id?.toString())
            ];
        } else if (audience === 'teacher') {
            const teachers = await this.teacherService.findAll();
            userIds = teachers.map(t => t._id?.toString());
        }

        // Notifier aussi le créateur si besoin
        if (creator) userIds.push(creator);

        // Supprimer les doublons
        userIds = [...new Set(userIds.filter(Boolean))];

        for (const userId of userIds) {
            await this.notificationService.create(
                userId,
                'Nouvel événement',
                `Un nouvel événement "${title}" a été ajouté à votre calendrier.`
            );
        }

        return savedCalender;
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
