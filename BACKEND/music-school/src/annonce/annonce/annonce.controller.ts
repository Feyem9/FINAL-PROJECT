import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    Req,
    UseGuards,
    UploadedFile,
    UseInterceptors,
    Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnnonceService } from './annonce.service';
import { Annonce } from 'src/schema/annonce.schema';

@Controller('annonce')
export class AnnonceController {
    constructor(private readonly annonceService: AnnonceService) { }

    // Création d'une annonce (admin ou créateur)
    @Post('/create')
    @UseInterceptors(FileInterceptor('image'))
    async createAnnonce(
        @Body() annonce: Annonce, 
        @UploadedFile() file: Express.Multer.File,
        @Req() req
    ) {
        // Si gestion de fichier, ajoute le chemin de l'image à l'annonce
        if (file) {
            annonce.image = file.path;
        }
        return await this.annonceService.createAnnonce(annonce, req.user);
    }

    // Récupérer toutes les annonces (avec pagination et recherche)
    @Get('/all')
    async getAnnonces(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search: string = ''
    ) {
        return await this.annonceService.searchAnnonces(page, limit, search);
    }

    // Récupérer une annonce par ID
    @Get('/:id')
    async getAnnonceById(@Param('id') id: string) {
        return await this.annonceService.getAnnonceById(id);
    }

    // Modifier une annonce (admin ou créateur)
    @Put('/:id')
    async updateAnnonce(
        @Param('id') id: string,
        @Body() updateData: Partial<Annonce>,
        @Req() req
    ) {
        return await this.annonceService.updateAnnonce(id, updateData, req.user);
    }

    // Supprimer une annonce (admin ou créateur)
    @Delete('/:id')
    async deleteAnnonce(@Param('id') id: string, @Req() req) {
        return await this.annonceService.deleteAnnonce(id, req.user);
    }

    // Ajouter une image à une annonce existante
    @Post(':id/image')
    @UseInterceptors(FileInterceptor('image'))
    async addImage(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Req() req
    ) {
        return await this.annonceService.addImageToAnnonce(id, file.path, req.user);
    }
}
