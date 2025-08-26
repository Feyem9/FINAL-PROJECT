import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher, TeacherDocument } from '../../schema/teacher.schema';
import { UserDto } from '../../DTO/userDto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { TeacherDto } from 'src/DTO/teacherDto';
import { MailerService } from '@nestjs-modules/mailer';
import { LoginDto } from 'src/DTO/login.dto';
import { ProfileImageService } from '../profile/profile-images/profile-image/profile-image.service';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly profileImageService: ProfileImageService

  ) { }

  async createTeacher(createTeacherDto: TeacherDto, file?: Express.Multer.File): Promise<{ teacher: Teacher; token: string }> {
    const { name, email, password, contact, role, speciality } = createTeacherDto;

    // Vérifier si l'email existe déjà
    const existingTeacher = await this.teacherModel.findOne({ email }).exec();
    if (existingTeacher) {
      throw new BadRequestException('Email already exists');
    }

    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Création du professeur avec le mot de passe sécurisé
    const newTeacher = new this.teacherModel({
      name,
      email,
      password: hashedPassword,
      contact,
      role,
      speciality,
      proofDocument: file ? `/uploads/${file.filename}` : null, // Ajout du fichier justificatif
    });

    await newTeacher.save();

    // Génération du token JWT
    const payload = { _id: newTeacher._id, email: newTeacher.email, role: newTeacher.role };
    const token = this.jwtService.sign(payload);
    await this.sendWelcomeEmail(newTeacher.email, newTeacher.name);


    return { teacher: newTeacher, token };
  }


  async sendWelcomeEmail(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Bienvenue dans notre plateforme',
      text: `Bonjour ${name},
      
Bienvenue sur notre plateforme éducative. Vous pouvez maintenant vous connecter avec votre adresse e-mail.`,
      html: `<p>Bonjour <strong>${name}</strong>,</p><p>Bienvenue sur Museschool ! Nous sommes ravis de vous compter parmi nous.</p>`
    });
  }

  async sendVerificationEmail(email: string, name: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Votre compte a été vérifié',
      template: './verification',
      context: { name },
    });
  }

  async sendDeletionEmail(email: string, name: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Votre compte a été supprimé',
      template: './deletion',
      context: { name },
    });
  }
  async findAll(): Promise<Teacher[]> {
    return this.teacherModel.find().exec();
  }

  async findById(id: string): Promise<Teacher> {
    const teacher = await this.teacherModel.findById(id).exec();
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    return teacher;
  }

  async updateTeacher(id: string, updateTeacherDto: Partial<TeacherDto>): Promise<Teacher> {
    if (updateTeacherDto.password) {
      // Hacher le nouveau mot de passe s'il est mis à jour
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updateTeacherDto.password, salt);
      updateTeacherDto = { ...updateTeacherDto, password: hashedPassword };
    }

    const updatedTeacher = await this.teacherModel.findByIdAndUpdate(id, updateTeacherDto, { new: true }).exec();
    if (!updatedTeacher) {
      throw new NotFoundException('Teacher not found');
    }
    return updatedTeacher;
  }

  async deleteTeacher(id: string): Promise<void> {
    const result = await this.teacherModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Teacher not found');
    }
  }

  async verifyTeacher(id: string, isVerified: boolean): Promise<Teacher> {
    const teacher = await this.teacherModel.findByIdAndUpdate(
      id,
      { isVerified },
      { new: true }
    ).exec();

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    await this.mailerService.sendMail({
      to: teacher.email,
      subject: 'Votre compte a été vérifié',
      text: `Bonjour ${teacher.name}, votre compte a été vérifié avec succès. Vous pouvez maintenant accéder à toutes les fonctionnalités.`
    });

    return teacher;
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      text: `Utilisez ce lien pour réinitialiser votre mot de passe : http://example.com/reset-password?token=${resetToken}`
    });
  }

  async signUpTeacher(teacherDto: TeacherDto, file?: Express.Multer.File): Promise<{
    teacher: any
  }> {
    const { name, email, password, contact, role, speciality } = teacherDto;

    const hashedPassword = await bcrypt.hash(password, 10)

    const teacher = new this.teacherModel({
      name,
      email,
      password: hashedPassword,
      contact,
      role,
      speciality,
      proofDocument: file ? `/uploads/${file.filename}` : null, // Ajout du fichier justificatif

    });

    await teacher.save()


    const { password: _, ...userWithoutPassword } = teacher.toObject(); // Supprimer le mot de passe

    // Envoyer le message de bienvenu par email
    await this.sendWelcomeEmail(teacher.email, teacher.name);


    return {
      teacher: userWithoutPassword
    }
  }

  async loginTeacher(loginDto: LoginDto): Promise<{ token: string, teacher: any }> {
    const { email, password } = loginDto;

    const teacher = await this.teacherModel.findOne({ email })
    console.log('teacher email : ', teacher.email);

    if (!teacher) {
      throw new UnauthorizedException('invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, teacher.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('invalid email or password');
    }

    const token = this.jwtService.sign({ id: teacher._id, email: teacher.email, role: teacher.role }, { secret: this.configService.get<string>('JWT_SECRET') })
    console.log('token is  : ', token);

    // return { token , teacher } 
    return {
      token,
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role, // ✅ on s'assure que role est bien là
      }
    };
  }

   async getUserLocationByGPS(lat: number, lon: number) {
      try {
        // Use Nominatim reverse geocoding to get location details from GPS coordinates
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log('GPS Location data:', data);
  
        return {
          city: data.address?.city || data.address?.town || data.address?.village || 'Inconnue',
          region: data.address?.state || 'Inconnue',
          country: data.address?.country || 'Inconnu',
          latitude: lat,
          longitude: lon,
          isGPS: true
        };
      } catch (error) {
        throw new NotFoundException('Impossible de récupérer la localisation depuis les coordonnées GPS');
      }
    }

async uploadProfileImage(file: Express.Multer.File, userId: string): Promise<any> {
  try {
    console.log('🔧 Service uploadProfileImage appelé:', {
      userId,
      filename: file.filename,
      originalname: file.originalname
    });

    // Vérifier que le teacher existe
    const teacher = await this.teacherModel.findById(userId);
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    // Construire l'URL relative de l'image
    const imageUrl = `/uploads/profile-images/${file.filename}`;
    
    // Appeler le service d'upload d'image de profil
    const profileImage = await this.profileImageService.uploadProfileImage(
      userId,                    // userId (string)
      'teacher',                // userType (fixe pour teacher)
      imageUrl,                 // imageUrl (string)
      file.originalname,        // fileName (string)
      file.size,               // fileSize (number)
      file.mimetype,           // mimeType (string)
    );

    // Mettre à jour le teacher avec la nouvelle image
    const updatedTeacher = await this.teacherModel.findByIdAndUpdate(
      userId,
      { 
        profileImage: imageUrl,
        image: imageUrl // Pour compatibilité
      },
      { new: true }
    );

    console.log('✅ Upload terminé avec succès');

    return {
      imageUrl: imageUrl,
      profileImage: profileImage,
      teacher: updatedTeacher
    };
    
  } catch (error) {
    console.error('❌ Erreur dans uploadProfileImage service:', error);
    throw error;
  }
}

}





// Options pour l'upload de fichier avec Multer
export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = uuidv4() + path.extname(file.originalname);
      callback(null, uniqueSuffix);
    },
  }),
};
