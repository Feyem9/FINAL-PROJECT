import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from 'src/DTO/signup.dto';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from 'src/DTO/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel : Model<User>,
        private jwtService: JwtService,
        private readonly configService : ConfigService
    ){
        const jwtSecret = this.configService.get<any | null>('JWT_SECRET');
    console.log('JWT Secret KEY:', jwtSecret); // Vérifie que la variable est bien chargée
    }

    async signUp(signUpDto : SignUpDto): Promise<{
        // token:string , 
        user:any}> {
        const {name , email , password , contact } = signUpDto;

        const hashedPassword = await bcrypt.hash(password , 10)

        const user = new this.userModel({
            name,
            email,
            password : hashedPassword,
            contact
        });

        await user.save()

        // const token = this.jwtService.sign({ id: user._id});

        const { password: _, ...userWithoutPassword } = user.toObject(); // Supprimer le mot de passe

        return { 
            // token , 
            user:userWithoutPassword
        } 
    }

    async login(loginDto: LoginDto) : Promise<{ token: string , user:any}> {
        const{ email , password } = loginDto;

        const user = await this.userModel.findOne({ email })
        console.log('user : ' , user);

        if(!user){
            throw new UnauthorizedException('invalid email or password');
        }

        const isPasswordMatched = await bcrypt.compare(password , user.password);

        if(!isPasswordMatched){
            throw new UnauthorizedException('invalid email or password');
        }

        const token = this.jwtService.sign({
          _id: user._id,
          email: user.email,
          role: user.role
        })
        console.log('token is  : ' , token);

        return { token , user } 
    }
}
