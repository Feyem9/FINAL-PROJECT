import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Annonce, annonceDocument } from 'src/schema/annonce.schema';

@Injectable()
export class AnnonceService {

    constructor(
        @InjectModel(Annonce.name) private readonly annonceModel: Model<annonceDocument>,
    ) { }

    // --------------------------------
    // SECTION 1 : CRUD
    // --------------------------------  

    async createAnnonce(annonce: Annonce, user: any): Promise<annonceDocument> {
        // Gestion des droits : seul un admin ou le créateur peut créer
        if (!user || user.role !== 'admin') {
            throw new ForbiddenException('Vous n\'avez pas les droits pour créer une annonce');
        }
        const newAnnonce = new this.annonceModel({ ...annonce, createdBy: user._id });
        return await newAnnonce.save();
    }

    async getAllAnnonces(): Promise<annonceDocument[]> {
        return await this.annonceModel.find().sort({ createdAt: -1 }).exec();
    }

    async getAnnonceById(id: string): Promise<annonceDocument> {
        const annonce = await this.annonceModel.findById(id).exec();
        if (!annonce) {
            throw new NotFoundException('Annonce non trouvée');
        }
        return annonce;
    }

    async updateAnnonce(id: string, updateData: Partial<Annonce>, user: any): Promise<annonceDocument> {
        // Gestion des droits : seul un admin ou le créateur peut modifier
        const annonce = await this.annonceModel.findById(id).exec();
        if (!annonce) throw new NotFoundException('Annonce à mettre à jour non trouvée');
        if (String(annonce.createdBy) !== String(user._id) && user.role !== 'admin') {
            throw new ForbiddenException('Vous n\'avez pas les droits pour modifier cette annonce');
        }
        Object.assign(annonce, updateData);
        return await annonce.save();
    }

    async deleteAnnonce(id: string, user: any): Promise<{ deleted: boolean }> {
        // Gestion des droits : seul un admin ou le créateur peut supprimer
        const annonce = await this.annonceModel.findById(id).exec();
        if (!annonce) throw new NotFoundException('Annonce à supprimer non trouvée');
        if (String(annonce.createdBy) !== String(user._id) && user.role !== 'admin') {
            throw new ForbiddenException('Vous n\'avez pas les droits pour supprimer cette annonce');
        }
        await annonce.deleteOne();
        return { deleted: true };
    }

    // Pagination et recherche
    async searchAnnonces(
        page = 1,
        limit = 10,
        search = ''
    ): Promise<{ annonces: annonceDocument[]; total: number; page: number; limit: number }> {
        const query = search
            ? {
                $or: [
                    { titre: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            }
            : {};
        const annonces = await this.annonceModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        const total = await this.annonceModel.countDocuments(query);
        return { annonces, total, page, limit };
    }

    // Gestion des fichiers (exemple pour image)
    async addImageToAnnonce(id: string, imagePath: string, user: any): Promise<annonceDocument> {
        const annonce = await this.annonceModel.findById(id).exec();
        if (!annonce) throw new NotFoundException('Annonce non trouvée');
        if (String(annonce.createdBy) !== String(user._id) && user.role !== 'admin') {
            throw new ForbiddenException('Vous n\'avez pas les droits pour modifier cette annonce');
        }
        annonce.image = imagePath;
        return await annonce.save();
    }
}
