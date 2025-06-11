import { Controller, Post, Body, Get, Param, Patch, Delete, HttpCode, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDto } from 'src/DTO/notification.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
// import { AuthGuard } from 'src/auth/auth.guard'; // Décommente si tu as un guard d'authentification

@ApiTags('Notifications')
@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    // Créer une notification
    @Post('/create')
    @ApiOperation({ summary: 'Créer une notification' })
    @ApiResponse({ status: 201, description: 'Notification créée avec succès.' })
    @HttpCode(HttpStatus.CREATED)
    // @UseGuards(AuthGuard) // Active si tu veux protéger la route
    async create(@Body() dto: NotificationDto) {
        return await this.notificationService.create(dto.user_id, dto.title, dto.message);
    }

    // recuperer toutes les notifications du site
    @Get('/all')
    @ApiOperation({ summary: 'Récupérer toutes les notifications' })
    @ApiResponse({ status: 200, description: 'Liste des notifications.' })
    // @UseGuards(AuthGuard) // Active si tu veux protéger la route
    async findAll() {
        return await this.notificationService.findAll();
    }


    // Récupérer toutes les notifications d'un utilisateur (avec pagination)
    @Get('user/:userId')
    @ApiOperation({ summary: 'Récupérer les notifications d\'un utilisateur' })
    @ApiResponse({ status: 200, description: 'Liste des notifications.' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Numéro de page' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre de notifications par page' })
    // @UseGuards(AuthGuard)
    async findAllForUser(
        @Param('userId') userId: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number
    ) {
        return await this.notificationService.findAllForUser(userId);
    }

    // Marquer une notification comme lue
    @Patch(':id/read')
    @ApiOperation({ summary: 'Marquer une notification comme lue' })
    @ApiResponse({ status: 200, description: 'Notification marquée comme lue.' })
    // @UseGuards(AuthGuard)
    async markAsRead(@Param('id') id: string,
        @Body('read') read: boolean) {
        return await this.notificationService.markAsRead(id , read);
    }

    // Supprimer une notification
    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer une notification' })
    @ApiResponse({ status: 200, description: 'Notification supprimée.' })
    // @UseGuards(AuthGuard)
    async delete(@Param('id') id: string) {
        return await this.notificationService.delete(id);
    }
}
