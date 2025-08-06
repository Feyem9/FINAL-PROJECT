import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { BlogService } from './blog.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateBlogDto, UpdateBlogDto } from 'src/DTO/blog.dto';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    @Post('/create')
    @ApiOperation({ summary: 'Créer un nouvel article de blog' })
    @ApiBody({ type: CreateBlogDto })
    @ApiResponse({ status: 201, description: 'Blog créé avec succès' })
    async createBlog(@Body() data: CreateBlogDto, @Req() req) {
        // Remove 'author' if present to avoid type conflict
        const { author, ...blogData } = data;
        return await this.blogService.createBlog(blogData, req.user);
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
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
        @Query('tag') tag: string,
        @Query('category') category: string,
        @Query('published') published: boolean,
    ) {
        return await this.blogService.getAllBlogs({ page, limit, search, tag, category, published });
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Récupérer un blog par ID' })
    @ApiParam({ name: 'id', description: 'ID du blog', example: '64b7f3c2e4b0f5a1d2c3e4f5' })
    @ApiResponse({ status: 200, description: 'Blog trouvé' })
    @ApiResponse({ status: 404, description: 'Blog non trouvé' })
    async getBlogById(@Param('id') id: string) {
        return await this.blogService.getBlogById(id);
    }

    @Put('/:id')
    @ApiOperation({ summary: 'Mettre à jour un blog' })
    @ApiParam({ name: 'id', description: 'ID du blog', example: '64b7f3c2e4b0f5a1d2c3e4f5' })
    @ApiBody({ type: UpdateBlogDto })
    @ApiResponse({ status: 200, description: 'Blog mis à jour' })
    @ApiResponse({ status: 404, description: 'Blog non trouvé' })
    async updateBlog(@Param('id') id: string, @Body() data: UpdateBlogDto, @Req() req) {
        return await this.blogService.updateBlog(id, data, req.user);
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
