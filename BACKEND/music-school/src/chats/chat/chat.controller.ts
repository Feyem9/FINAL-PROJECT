import { Controller, Get, Post, Body, Param, UploadedFile, UseInterceptors, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from '../../DTO/chat.dto';
import { Chat } from '../../schema/chat.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 📩 Créer un message via HTTP (optionnel si tu utilises uniquement Socket.IO)
  @Post('/message')
  async createMessage(@Body() createChatDto: ChatDto): Promise<Chat> {
    return this.chatService.createMessage(createChatDto);
  }

  // 📚 Récupérer tous les messages entre deux utilisateurs
  @Get(':user1/:user2')
  async getMessagesBetween(
    @Param('user1') user1: string,
    @Param('user2') user2: string,
  ): Promise<Chat[]> {
    return this.chatService.getMessagesBetween(user1, user2);
  }

  //  @Post('upload')
  // @UseInterceptors(FileInterceptor('file', {
  //   storage: diskStorage({
  //     destination: './uploads', // Dossier local
  //     filename: (req, file, callback) => {
  //       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //       const ext = extname(file.originalname);
  //       callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  //     },
  //   }),
  // }))
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   return {
  //     filename: file.filename,
  //     url: `http://localhost:3000/uploads/${file.filename}`,
  //   };
  // }

  // Remplacez votre configuration d'upload par celle-ci :
@Post('upload')
@UseInterceptors(FileInterceptor('file', {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      // Sécurisation du nom de fichier
      const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(safeName);
      callback(null, `${uniqueSuffix}${ext}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, callback) => {
    // Types de fichiers autorisés
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return callback(null, true);
    } else {
      callback(new Error('Type de fichier non autorisé'), false);
    }
  },
}))
async uploadFile(@UploadedFile() file: Express.Multer.File) {
  if (!file) {
    throw new Error('Aucun fichier fourni');
  }

  return {
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimeType: file.mimetype,
    url: `http://localhost:3000/uploads/${file.filename}`,
  };
}

  @Post(':messageId/read')
async markAsRead(
  @Param('messageId') messageId: string,
  @Body('userId') userId: string,
): Promise<void> {
  return this.chatService.markAsRead(messageId, userId);
}

@Get('unread/:userId')
async getUnreadCount(@Param('userId') userId: string): Promise<{ count: number }> {
  const count = await this.chatService.getUnreadCount(userId);
  return { count };
}

@Get('search/:user1/:user2/:query')
async searchMessages(
  @Param('user1') user1: string,
  @Param('user2') user2: string,
  @Param('query') query: string,
): Promise<Chat[]> {
  return this.chatService.searchMessages(user1, user2, query);
}

@Delete(':messageId')
async deleteMessage(
  @Param('messageId') messageId: string,
  @Body('userId') userId: string,
): Promise<{ success: boolean }> {
  const success = await this.chatService.deleteMessage(messageId, userId);
  return { success };
}

}
