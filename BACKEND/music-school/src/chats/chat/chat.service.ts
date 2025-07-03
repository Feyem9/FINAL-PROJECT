import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from '../../schema/chat.schema';
import { ChatDto } from '../../DTO/chat.dto';
import { v4 as uuidv4 } from 'uuid';  // ⚡ uuid pour générer un ID unique


@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async createMessage(createChatDto: ChatDto): Promise<Chat> {
    const newMessage = new this.chatModel({
      ...createChatDto,
      id: uuidv4(),  // 👈 Génère un ID unique
    });
    return newMessage.save();
  }

  async getMessagesBetween(user1: string, user2: string): Promise<Chat[]> {
    return this.chatModel.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    }).sort({ createdAt: 1 });
  }
}
