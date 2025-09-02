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

  async markAsRead(messageId: string, userId: string): Promise<void> {
  await this.chatModel.findByIdAndUpdate(messageId, {
    $addToSet: { readBy: userId }
  });
}

async getUnreadCount(userId: string): Promise<number> {
  return this.chatModel.countDocuments({
    receiverId: userId,
    readBy: { $ne: userId }
  });
}

async searchMessages(senderId: string, receiverId: string, query: string): Promise<Chat[]> {
  return this.chatModel.find({
    $and: [
      {
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      {
        message: { $regex: query, $options: 'i' }
      }
    ]
  }).sort({ createdAt: -1 }).limit(10);
}

async deleteMessage(messageId: string, userId: string): Promise<boolean> {
  const result = await this.chatModel.findOneAndUpdate(
    { _id: messageId, senderId: userId },
    { $set: { deleted: true, deletedAt: new Date() } }
  );
  return !!result;
}

}
