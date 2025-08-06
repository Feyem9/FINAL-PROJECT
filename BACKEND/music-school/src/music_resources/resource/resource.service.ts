import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { MusicResource } from '../../schema/resource.schema';
import { CreateMusicResourceDto, UpdateMusicResourceDto } from '../../DTO/resource.dto';

@Injectable()
export class MusicResourcesService {
  constructor(
    @InjectModel(MusicResource.name) private readonly musicResourceModel: Model<MusicResource>,
  ) {}

  async create(createDto: CreateMusicResourceDto): Promise<MusicResource> {
    try {
      const createdResource = new this.musicResourceModel(createDto);
      return await createdResource.save();
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la création de la ressource.');
    }
  }

  async findAll(query?: { search?: string, tags?: string[] }): Promise<MusicResource[]> {
    const filter: FilterQuery<MusicResource> = {};

    if (query?.search) {
      filter.title = { $regex: query.search, $options: 'i' }; // recherche insensible à la casse
    }

    if (query?.tags && query.tags.length > 0) {
      filter.tags = { $in: query.tags };
    }

    return this.musicResourceModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<MusicResource> {
    const resource = await this.musicResourceModel.findById(id).exec();
    if (!resource) throw new NotFoundException(`Ressource avec ID "${id}" non trouvée.`);
    return resource;
  }

  async update(id: string, updateDto: UpdateMusicResourceDto): Promise<MusicResource> {
    const updated = await this.musicResourceModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Impossible de mettre à jour : ressource avec ID "${id}" non trouvée.`);
    return updated;
  }

  async delete(id: string): Promise<MusicResource> {
    const deleted = await this.musicResourceModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Impossible de supprimer : ressource avec ID "${id}" non trouvée.`);
    return deleted;
  }
}
