import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from '../../schema/admin.schema';
import { UserDto } from '../../DTO/userDto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as cron from 'node-cron';
import { AdminDto } from 'src/DTO/adminDto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from 'src/DTO/login.dto';


@Injectable()
export class AdminService {
  // constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>) {}
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,        
    private mailerService: MailerService

  ) {const jwtSecret = this.configService.get<any | null>('JWT_SECRET_KEY');
    console.log('JWT Secret KEY:', jwtSecret); // Vérifie que la variable est bien chargée
    
    // Planifier l'envoi du token toutes les 24 heures
    cron.schedule('0 0 * * *', async () => {
      await this.sendDailyToken();  
    });
  }

  
  async createAdmin(createAdminDto: UserDto): Promise<Admin> {
    if (createAdminDto.role !== 'admin') {
      throw new BadRequestException('Ce service est uniquement pour créer des administrateurs.');
    }

    if (createAdminDto.email !== 'feyemlionel@gmail.com') {
      throw new BadRequestException('Seul le fondateur peut être administrateur !');
    }

    const newAdmin = new this.adminModel(createAdminDto);
    await newAdmin.save();

    await this.sendTokenEmail(newAdmin);
    return newAdmin;
  }

  async sendTokenEmail(admin: Admin): Promise<void> {
    const payload = { id: admin._id, email: admin.email, role: admin.role };
    const token = this.jwtService.sign(payload, {
      expiresIn: '24h',
    });

    await this.mailerService.sendMail({
      to: admin.email,
      subject: 'Votre accès administrateur',
      text: `Bonjour, voici votre token pour vous connecter : ${token}`,
      html: `<p>Bonjour,</p><p>Voici votre token pour vous connecter :</p><p><strong>${token}</strong></p>`
    });
  }

  async sendDailyToken(): Promise<void> {
    const admins = await this.adminModel.find().exec();
    for (const admin of admins) {
      await this.sendTokenEmail(admin);
    }
  }

  async findAll(): Promise<Admin[]> {
    return this.adminModel.find().exec();
  }

  async findById(id: string): Promise<Admin> {
    const admin = await this.adminModel.findById(id).exec();
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return admin;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return await this.adminModel.findOne({ email }).exec();
  }


  async updateAdmin(id: string, updateAdminDto: Partial<UserDto>): Promise<Admin> {
    if (updateAdminDto.role && updateAdminDto.role !== 'admin') {
      throw new BadRequestException('Impossible de changer le rôle de l’administrateur.');
    }
  
    const updatedAdmin = await this.adminModel.findByIdAndUpdate(id, updateAdminDto, {
      new: true,
    }).exec();
  
    if (!updatedAdmin) {
      throw new NotFoundException('Admin not found');
    }
  
    return updatedAdmin;
  }

  async deleteAdmin(id: string): Promise<void> {
    const result = await this.adminModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Admin not found');
    }
  }

      async signUpAdmin(adminDto : AdminDto): Promise<{
          admin:any}> {
          const {name , email , password , contact , role} = adminDto;
  
          const hashedPassword = await bcrypt.hash(password , 10)

          if (adminDto.role !== 'admin') {
            throw new BadRequestException('Ce service est uniquement pour créer des administrateurs.');
          }
      
          if (adminDto.email !== 'feyemlionel@gmail.com') {
            throw new BadRequestException('Seul le fondateur peut être administrateur !');
          }
  
          const admin = new this.adminModel({
              name,
              email,
              password : hashedPassword,
              contact, 
              role
          });
  
          await admin.save()
  
  
          const { password: _, ...userWithoutPassword } = admin.toObject(); // Supprimer le mot de passe
  
          return { 
              admin:userWithoutPassword
          } 
      }

          async loginAdmin(loginDto: LoginDto) : Promise<{ token: string , admin:any}> {
              const{ email , password } = loginDto;
      
              const admin = await this.adminModel.findOne({ email })
              console.log('admin email : ' , admin.email);
      
              if(!admin){
                  throw new UnauthorizedException('invalid email or password');
              }
      
              const isPasswordMatched = await bcrypt.compare(password , admin.password);
      
              if(!isPasswordMatched){
                  throw new UnauthorizedException('invalid email or password');
              }
      
              const token = this.jwtService.sign({ id: admin._id , email: admin.email , role: admin.role} , {secret : this.configService.get<string>('JWT_SECRET_KEY') , expiresIn : this.configService.get<string>('JWT_EXPIRE')})
              console.log('token is  : ' , token);


                // Envoyer le token par email
                await this.sendLoginToken(admin, token);
      
              return { token , admin } 
          }

          async sendLoginToken(admin: Admin, token: string): Promise<void> {
            await this.mailerService.sendMail({
              to: admin.email,
              subject: 'Votre nouveau token de connexion',
              text: `Bonjour ${admin.name}, voici votre nouveau token pour vous connecter : ${token}`,
              html: `<p>Bonjour <strong>${admin.name}</strong>,</p>
                     <p>Voici votre nouveau token pour vous connecter :</p>
                     <p><strong>${token}</strong></p>
                     <p>Ce token est valide pendant 24 heures.</p>`
            });
          }

}
