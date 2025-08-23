import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from '../../schema/student.schema';
import { StudentDto } from 'src/DTO/studentDto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { MailerService } from '@nestjs-modules/mailer';
import { LoginDto } from 'src/DTO/login.dto';
import { ConfigService } from '@nestjs/config';
import { log } from 'util';
import { Profile } from 'passport';
import { ProfileService } from '../profile/profile.service';
import { Course } from 'src/schema/course.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    private configService: ConfigService,
    private readonly profile: ProfileService

  ) { }

  async createStudent(createStudentDto: StudentDto): Promise<{ student: Student; token: string }> {
    const { name, email, password, contact, level, instrument } = createStudentDto;

    // Vérifier si l'email existe déjà
    const existingStudent = await this.studentModel.findOne({ email }).exec();
    if (existingStudent) {
      throw new BadRequestException('Email already exists');
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'élève avec les informations complètes
    const newStudent = new this.studentModel({
      name,
      email,
      password: hashedPassword,
      contact,
      level,
      instrument, // Ajout de l’instrument préféré
      role: 'student',
    });

    await newStudent.save();

    // Génération du token JWT
    const payload = { _id: newStudent._id, email: newStudent.email, role: newStudent.role };
    const token = this.jwtService.sign(payload);
    await this.sendWelcomeEmail(email, name);

    return { student: newStudent, token };
  }

  async findAll(): Promise<Student[]> {
    return this.studentModel.find().exec();
  }

  async findById(id: string): Promise<Student> {
    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  async updateStudent(id: string, updateStudentDto: Partial<StudentDto>): Promise<Student> {
    if (updateStudentDto.password) {
      // Hachage du mot de passe avant mise à jour
      const hashedPassword = await bcrypt.hash(updateStudentDto.password, 10);
      updateStudentDto = { ...updateStudentDto, password: hashedPassword };
    }

    const updatedStudent = await this.studentModel.findByIdAndUpdate(id, updateStudentDto, { new: true }).exec();
    if (!updatedStudent) {
      throw new NotFoundException('Student not found');
    }
    return updatedStudent;
  }

  async deleteStudent(id: string): Promise<void> {
    const student = await this.findById(id);
    await this.sendDeletionEmail(student.email, student.name);
    const result = await this.studentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Student not found');
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Bienvenue à Museschool',
      text: `Bonjour ${name},
      
      Bienvenue sur notre plateforme éducative. Vous pouvez maintenant vous connecter avec votre adresse e-mail.`,
      html: `<p>Bonjour <strong>${name}</strong>,</p><p>Bienvenue sur Museschool ! Nous sommes ravis de vous compter parmi nous.</p>`,
      context: { name },
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
      template: 'deletion',
      context: { name },
    });
  }


  async signUpStudent(studentDto: StudentDto): Promise<{
    student: any
  }> {
    const { name, email, password, contact, role, level, instrument } = studentDto;
    console.log('studentDto : ', studentDto);

    const hashedPassword = await bcrypt.hash(password, 10)

    const student = new this.studentModel({
      name,
      email,
      password: hashedPassword,
      contact,
      role,
      level,
      instrument
    });

    await student.save()


    const { password: _, ...userWithoutPassword } = student.toObject(); // Supprimer le mot de passe

    return {
      student: userWithoutPassword
    }
  }

  async loginStudent(loginDto: LoginDto): Promise<{ token: string, student: any }> {
    const { email, password } = loginDto;

    const student = await this.studentModel.findOne({ email })
    console.log('student email : ', student.email);

    if (!student) {
      throw new UnauthorizedException('invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, student.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('invalid email or password');
    }

    const token = this.jwtService.sign({ id: student._id, email: student.email, role: student.role }, { secret: this.configService.get<string>('JWT_SECRET') })
    console.log('token is  : ', token);
    // Envoyer le token par email
    await this.sendWelcomeEmail(student.email, student.name);

    return { token, student }
  }



  /**
   * here i want to add a method to store the student profile image in the database
   * @param id Student ID
   * @param imageUrl URL of the profile image
   * @returns Updated student with the profile image URL
   */
  // async updateStudentProfileImage(id: string, imageUrl: string): Promise<Student> {
  //   return this.profile.updateProfileImage(id, 'student', imageUrl);
  // }


  async getEnrolledCourses(id: string): Promise<Course[]> {
    const student = await this.findById(id);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const courses = await this.courseModel.find({ _id: { $in: student.enrolledCourses } }).exec();
    // if (!courses || courses.length === 0) {
    //   throw new NotFoundException('No enrolled courses found for this student');
    // }
    return courses || [];
  }
  async enrollInCourse(studentId: string, courseId: string): Promise<Course[]> {
    const student = await this.findById(studentId);
    console.log('student is:', student?.name);
    console.log('course id:', courseId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Vérifier si déjà inscrit
    if (student.enrolledCourses.includes(courseId)) {
      throw new Error('Student already enrolled in this course');
    }

    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Ajouter le cours à la liste
    student.enrolledCourses.push(courseId);
    await student.save();

    try {
      // Envoyer l'e-mail de confirmation
      // await this.mailerService.sendMail({
      //   to: student.email,
      //   subject: 'Inscription au cours réussie',
      //   template: 'enrollment',
      //   context: {
      //     name: student.name,
      //     courseTitle: course.title,
      //     enrollmentDate: new Date().toLocaleDateString('fr-FR'),
      //   },
      // });
      await this.mailerService.sendMail({
        to: student.email,
        subject: 'Inscription au cours réussie',
        html: `<h2>Bonjour ${student.name}</h2><p>Inscrit au cours : ${course.title}</p>`,
      });
      console.log(`Email sent successfully to ${student.email}`);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      throw new Error('Inscription réussie, mais l\'envoi de l\'email a échoué.');
      // L'inscription continue même si l'email échoue
    }

    // Récupérer et retourner la liste complète des cours inscrits
    const updatedCourses = await this.courseModel.find({
      _id: { $in: student.enrolledCourses }
    });

    return updatedCourses;
  }
}
