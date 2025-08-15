import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BlogService } from './blog.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateBlogDto, UpdateBlogDto } from 'src/DTO/blog.dto';
import { AuthGuard } from '@nestjs/passport';
import { log } from 'console';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    @Post('/create')
    @UseGuards(AuthGuard('jwt')) // ✅ Protection + injection de req.user
    @UseInterceptors(FileInterceptor('image'))
    @ApiOperation({ summary: 'Créer un nouvel article de blog' })
    @ApiBody({ type: CreateBlogDto })
    @ApiResponse({ status: 201, description: 'Blog créé avec succès' })
    @ApiResponse({ status: 403, description: 'Utilisateur non authentifié ou auteur défini manuellement' })
    @ApiResponse({ status: 400, description: 'Données invalides' })
    @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 404, description: 'Ressource non trouvée' })
    @ApiResponse({ status: 409, description: 'Conflit de données' })
    @ApiResponse({ status: 422, description: 'Données non traitables' })
    @ApiResponse({ status: 429, description: 'Trop de requêtes' })
    @ApiResponse({ status: 503, description: 'Service indisponible' })
    @ApiResponse({ status: 504, description: 'Délai d’attente dépassé' })
    async createBlog(
        @UploadedFile() file: Express.Multer.File,
        @Body() data: CreateBlogDto,
        @Req() req
    ) {

        try {
            const { author, ...blogData } = data;
            console.log('Utilisateur authentifié:', req.user);
            console.log('Auteur du blog (peut être défini manuellement):', author);
            console.log('Données du blog (sans auteur):', blogData);
      

            return await this.blogService.createBlog({ ...blogData, image: file ? file.filename : undefined }, req.user);
        } catch (error) {
            console.error('Error creating blog:', error);
            throw error; // Propagate the error to the global exception filter

        }
    }


    @Get('/all')
    @ApiOperation({ summary: 'Récupérer tous les blogs avec pagination, recherche, tag, catégorie, publication' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiQuery({ name: 'search', required: false, type: String, example: 'musique' })
    @ApiQuery({ name: 'tag', required: false, type: String, example: 'piano' })
    @ApiQuery({ name: 'category', required: false, type: String, example: 'cours' })
    @ApiQuery({ name: 'published', required: false, type: Boolean, example: true })
    @ApiResponse({ status: 200, description: 'Liste paginée des blogs' })
    async getAllBlogs(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('search') search: string,
        @Query('tag') tag: string,
        @Query('category') category: string,
        @Query('published') published: string, // string venant du query
    ) {
        try {
            const pageNumber = parseInt(page) || 1;
            const limitNumber = parseInt(limit) || 10;
            const publishedBool = published === 'true' ? true : published === 'false' ? false : undefined;

            return await this.blogService.getAllBlogs({
                page: pageNumber,
                limit: limitNumber,
                search,
                tag,
                category,
                published: publishedBool
            });
        } catch (error) {
            console.error('Error fetching blogs:', error);
            throw error; // Propagate the error to the global exception filter

        }
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Récupérer un blog par ID' })
    @ApiParam({ name: 'id', description: 'ID du blog', example: '64b7f3c2e4b0f5a1d2c3e4f5' })
    @ApiResponse({ status: 200, description: 'Blog trouvé' })
    @ApiResponse({ status: 404, description: 'Blog non trouvé' })
    async getBlogById(@Param('id') id: string) {
        try {
            return await this.blogService.getBlogById(id);
        } catch (error) {
            console.error('Error fetching blog by ID:', error);
            throw error; // Propagate the error to the global exception filter
        }
    }

    @Put('/:id')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('image'))
    @ApiParam({ name: 'id', description: 'ID du blog', example: '64b7f3c2e4b0f5a1d2c3e4f5' })
    @ApiBody({ type: UpdateBlogDto })
    @ApiResponse({ status: 200, description: 'Blog mis à jour avec succès' })
    @ApiResponse({ status: 404, description: 'Blog non trouvé' })
    @ApiResponse({ status: 403, description: 'Accès interdit' })
    @ApiResponse({ status: 400, description: 'Données invalides' })
    @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 409, description: 'Conflit de données' })
    @ApiResponse({ status: 422, description: 'Données non traitables' })
    @ApiResponse({ status: 429, description: 'Trop de requêtes' })
    @ApiResponse({ status: 503, description: 'Service indisponible' })
    @ApiOperation({ summary: 'Mettre à jour un blog' })
    async updateBlog(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: UpdateBlogDto,
        @Req() req
    ) {
        try {
            console.log('Updating blog with ID:', id);
            console.log('Request body:', body);
            return await this.blogService.updateBlog(id, body, req.user, file);
        } catch (error) {
            console.error('Error updating blog:', error);
            throw error; // Propagate the error to the global exception filter
        }
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Supprimer un blog' })
    @ApiParam({ name: 'id', description: 'ID du blog', example: '64b7f3c2e4b0f5a1d2c3e4f5' })
    @ApiResponse({ status: 200, description: 'Blog supprimé' })
    @ApiResponse({ status: 404, description: 'Blog non trouvé' })
    async deleteBlog(@Param('id') id: string, @Req() req) {
        return await this.blogService.deleteBlog(id, req.user);
    }

    @Post('/:id/comment')
    @ApiOperation({ summary: 'Ajouter un commentaire à un blog' })
    @ApiParam({ name: 'id', description: 'ID du blog', example: '64b7f3c2e4b0f5a1d2c3e4f5' })
    @ApiBody({ schema: { type: 'object', properties: { comment: { type: 'string', example: 'Super article !' } } } })
    @ApiResponse({ status: 200, description: 'Commentaire ajouté' })
    async addComment(@Param('id') id: string, @Body('comment') comment: string, @Req() req) {
        return await this.blogService.addComment(id, req.user, comment);
    }

    @Put('/:id/publish')
    @ApiOperation({ summary: 'Publier un blog' })
    @ApiParam({ name: 'id', description: 'ID du blog', example: '64b7f3c2e4b0f5a1d2c3e4f5' })
    @ApiResponse({ status: 200, description: 'Blog publié' })
    async publishBlog(@Param('id') id: string, @Req() req) {
        return await this.blogService.publishBlog(id, req.user);
    }
}
