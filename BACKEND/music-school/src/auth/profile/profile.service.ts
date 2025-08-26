import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../../schema/admin.schema';
import { Teacher } from '../../schema/teacher.schema';
import { Student } from '../../schema/student.schema';
import { ProfileImageService } from './profile-images/profile-image/profile-image.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
    private readonly profileImageService: ProfileImageService
  ) { }

  async updateProfileImage(
    userId: string,
    role: 'admin' | 'teacher' | 'student',
    imagePath: string,
  ): Promise<any> {
    switch (role) {
      case 'admin':
        return await this.updateAdminImage(userId, imagePath);
      case 'teacher':
        return await this.updateTeacherImage(userId, imagePath);
      case 'student':
        return await this.updateStudentImage(userId, imagePath);
      default:
        throw new NotFoundException('Invalid user role');
    }
  }

  async findById(userId: string): Promise<Admin | null> {
    const admin = await this.adminModel.findById(userId);
    if (admin) {
      return admin;
    }


    return admin;
  }

  private async updateAdminImage(userId: string, imagePath: string) {
    const admin = await this.adminModel.findByIdAndUpdate(
      userId,
      { image: imagePath },
      { new: true },
    );
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return admin;
  }

  private async updateTeacherImage(userId: string, imagePath: string) {
    const teacher = await this.teacherModel.findByIdAndUpdate(
      userId,
      { image: imagePath },
      { new: true },
    );
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    return teacher;
  }

  private async updateStudentImage(userId: string, imagePath: string) {
    const student = await this.studentModel.findByIdAndUpdate(
      userId,
      { image: imagePath },
      { new: true },
    );
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  async getUserLocationByIP(ip: string) {
    try {
      // Handle localhost/undefined IPs
      if (!ip || ip === '::1' || ip === '127.0.0.1') {
        return {
          ip: ip || 'localhost',
          city: 'Local Development',
          region: 'Development Environment',
          country: 'Unknown',
          latitude: 0,
          longitude: 0,
          isLocalhost: true
        };
      }

      const response = await fetch(`http://ip-api.com/json/${ip}`);
      const data = await response.json();
      console.log('Location data:', data);

      // Check if the response contains an error
      if (data.status === 'fail') {
        throw new Error(data.message || 'Failed to get location data');
      }

      return {
        ip: data.query,
        city: data.city || 'Inconnue',
        region: data.regionName || 'Inconnue',
        country: data.country || 'Inconnu',
        latitude: data.lat || 0,
        longitude: data.lon || 0,
        isLocalhost: false
      };
    } catch (error) {
      throw new NotFoundException('Impossible de récupérer la localisation');
    }
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

      // Vérifier que le admin existe
      const admin = await this.adminModel.findById(userId);
      if (!admin) {
        throw new Error('Admin not found');
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

      // Mettre à jour le admin avec la nouvelle image
      const updatedAdmin = await this.adminModel.findByIdAndUpdate(
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
        admin: updatedAdmin
      };

    } catch (error) {
      console.error('❌ Erreur dans uploadProfileImage service:', error);
      throw error;
    }
  }
}