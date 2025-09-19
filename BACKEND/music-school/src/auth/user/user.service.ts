// import { Inject, Injectable } from '@nestjs/common';
// import { User } from 'src/interfaces/user.interface';
// import { Model } from 'mongoose';

// @Injectable()

// export class UserService {
//     constructor(
//         @Inject('USER_MODEL')
//         private userModel: Model<User>,
//     ){}

//     async create():Promise<User>{
//             const newUser = new this.userModel({
//                 name: "christian",
//                 email: "feyemlionel@gmail.com",
//                 password: "123456",
//                 contact: "235647890987"
//             });
//             return newUser.save();
        
//     }
    

//     async findAll(): Promise<User[]> {
//         return this.userModel.find().exec();
//       }
// }
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/interfaces/user.interface';
import { Model } from 'mongoose';
import { UserDto } from 'src/DTO/userDto';
import { InjectModel } from '@nestjs/mongoose';
import { async } from 'rxjs';
import { Admin, AdminDocument } from 'src/schema/admin.schema';
import { Student, StudentDocument } from 'src/schema/student.schema';
import { Teacher, TeacherDocument } from 'src/schema/teacher.schema';
// import { User } from 'src/schema/user.schema';

@Injectable()

export class UserService {
    constructor(
        @Inject('USER_MODEL')
        private userModel: Model<User>,
        @InjectModel(Teacher.name) private readonly teacherModel: Model<TeacherDocument>,
        @InjectModel(Student.name) private readonly studentModel: Model<StudentDocument>,
        @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
  
    ){}

    async createUser(createUserDto: UserDto): Promise<User> {
        if (createUserDto.role === 'teacher') {
          return new this.teacherModel(createUserDto).save();
        } else if (createUserDto.role === 'student') {
          return new this.studentModel(createUserDto).save();
        } else if (createUserDto.role === 'admin') {
          return new this.adminModel(createUserDto).save();
        }
        throw new BadRequestException('Invalid role');
      }
        
    

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
      }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }
}
