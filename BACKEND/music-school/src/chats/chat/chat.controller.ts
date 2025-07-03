import { Controller, Get, Post, Body, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from '../../DTO/chat.dto';
import { Chat } from '../../schema/chat.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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

   @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // Dossier local
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
      url: `http://localhost:3000/uploads/${file.filename}`,
    };
  }
}
