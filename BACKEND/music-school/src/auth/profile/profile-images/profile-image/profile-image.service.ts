import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProfileImage } from '../../../../interfaces/profileImage.interface';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ProfileImageService {
  constructor(
    @InjectModel('ProfileImage')
    private readonly profileImageModel: Model<IProfileImage>,
  ) {}

  // Votre méthode existante
  async uploadProfileImage(
    userId: string,
    userType: 'admin' | 'teacher' | 'student',
    imageUrl: string,
    fileName: string,
    fileSize: number,
    mimeType: string,
  ): Promise<IProfileImage> {
    // Check if user already has a profile image
    const existingProfileImage = await this.profileImageModel.findOne({ userId });
    
    if (existingProfileImage) {
      // Supprimer l'ancien fichier si il existe
      await this.deleteImageFile(existingProfileImage.imageUrl);
      
      // Update existing profile image
      return await this.profileImageModel.findByIdAndUpdate(
        existingProfileImage._id,
        {
          imageUrl,
          fileName,
          fileSize,
          mimeType,
          uploadedAt: new Date(),
        },
        { new: true },
      );
    } else {
      // Create new profile image record
      const newProfileImage = new this.profileImageModel({
        userId,
        userType,
        imageUrl,
        fileName,
        fileSize,
        mimeType,
      });
      
      return await newProfileImage.save();
    }
  }

  // Récupérer l'image de profil par userId
  async getProfileImageByUserId(userId: string): Promise<IProfileImage | null> {
    return await this.profileImageModel.findOne({ userId }).exec();
  }

  // Récupérer toutes les images par type d'utilisateur
  async getProfileImagesByType(
    userType: 'admin' | 'teacher' | 'student',
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    images: IProfileImage[];
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const [images, total] = await Promise.all([
      this.profileImageModel
        .find({ userType })
        .sort({ uploadedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.profileImageModel.countDocuments({ userType }),
    ]);

    return {
      images,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Supprimer une image de profil
  async deleteProfileImage(userId: string): Promise<boolean> {
    const profileImage = await this.profileImageModel.findOne({ userId });
    
    if (!profileImage) {
      return false;
    }

    // Supprimer le fichier physique
    await this.deleteImageFile(profileImage.imageUrl);
    
    // Supprimer l'enregistrement de la base de données
    await this.profileImageModel.deleteOne({ userId });
    
    return true;
  }

  // Vérifier si un utilisateur a une image de profil
  async profileImageExists(userId: string): Promise<boolean> {
    const count = await this.profileImageModel.countDocuments({ userId });
    return count > 0;
  }

  // Récupérer les statistiques des images de profil
  async getProfileImageStats(): Promise<{
    total: number;
    byUserType: { [key: string]: number };
    totalSize: number;
    averageSize: number;
  }> {
    const [stats, sizeStats] = await Promise.all([
      this.profileImageModel.aggregate([
        {
          $group: {
            _id: '$userType',
            count: { $sum: 1 },
          },
        },
      ]),
      this.profileImageModel.aggregate([
        {
          $group: {
            _id: null,
            totalSize: { $sum: '$fileSize' },
            averageSize: { $avg: '$fileSize' },
            total: { $sum: 1 },
          },
        },
      ]),
    ]);

    const byUserType = {};
    stats.forEach(stat => {
      byUserType[stat._id] = stat.count;
    });

    const sizeData = sizeStats[0] || { totalSize: 0, averageSize: 0, total: 0 };

    return {
      total: sizeData.total,
      byUserType,
      totalSize: sizeData.totalSize,
      averageSize: Math.round(sizeData.averageSize || 0),
    };
  }

  // Récupérer toutes les images de profil avec pagination
  async getAllProfileImages(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    images: IProfileImage[];
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const [images, total] = await Promise.all([
      this.profileImageModel
        .find({})
        .sort({ uploadedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.profileImageModel.countDocuments({}),
    ]);

    return {
      images,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Nettoyer les images orphelines (fichiers sans enregistrement DB)
  async cleanupOrphanedImages(): Promise<{
    deletedFiles: string[];
    errors: string[];
  }> {
    const deletedFiles: string[] = [];
    const errors: string[] = [];

    try {
      const uploadsPath = join(process.cwd(), 'uploads');
      const files = fs.readdirSync(uploadsPath);
      const dbImages = await this.profileImageModel.find({}).select('imageUrl').exec();
      
      const dbImagePaths = dbImages.map(img => img.imageUrl.replace('/uploads/', ''));

      for (const file of files) {
        if (!dbImagePaths.includes(file)) {
          try {
            fs.unlinkSync(join(uploadsPath, file));
            deletedFiles.push(file);
          } catch (error) {
            errors.push(`Erreur lors de la suppression de ${file}: ${error.message}`);
          }
        }
      }
    } catch (error) {
      errors.push(`Erreur lors du nettoyage: ${error.message}`);
    }

    return { deletedFiles, errors };
  }

  // Méthode privée pour supprimer un fichier image
  private async deleteImageFile(imageUrl: string): Promise<void> {
    try {
      const filePath = join(process.cwd(), imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Fichier supprimé: ${filePath}`);
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression du fichier ${imageUrl}:`, error);
    }
  }

  // Mettre à jour les informations d'une image (sans changer le fichier)
  async updateProfileImageInfo(
    userId: string,
    updateData: Partial<{
      fileName: string;
      userType: 'admin' | 'teacher' | 'student';
    }>,
  ): Promise<IProfileImage> {
    const profileImage = await this.profileImageModel.findOne({ userId });
    
    if (!profileImage) {
      throw new NotFoundException('Image de profil non trouvée');
    }

    return await this.profileImageModel.findByIdAndUpdate(
      profileImage._id,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true },
    );
  }

  // Rechercher des images par critères
  async searchProfileImages(searchCriteria: {
    userType?: 'admin' | 'teacher' | 'student';
    minSize?: number;
    maxSize?: number;
    mimeType?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<IProfileImage[]> {
    const query: any = {};

    if (searchCriteria.userType) {
      query.userType = searchCriteria.userType;
    }

    if (searchCriteria.minSize || searchCriteria.maxSize) {
      query.fileSize = {};
      if (searchCriteria.minSize) query.fileSize.$gte = searchCriteria.minSize;
      if (searchCriteria.maxSize) query.fileSize.$lte = searchCriteria.maxSize;
    }

    if (searchCriteria.mimeType) {
      query.mimeType = searchCriteria.mimeType;
    }

    if (searchCriteria.dateFrom || searchCriteria.dateTo) {
      query.uploadedAt = {};
      if (searchCriteria.dateFrom) query.uploadedAt.$gte = searchCriteria.dateFrom;
      if (searchCriteria.dateTo) query.uploadedAt.$lte = searchCriteria.dateTo;
    }

    return await this.profileImageModel.find(query).sort({ uploadedAt: -1 }).exec();
  }
}