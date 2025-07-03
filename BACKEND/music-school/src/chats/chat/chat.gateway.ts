import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ChatDto } from '../../DTO/chat.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) { }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      console.log(`✅ User ${userId} connecté`);
    } else {
      console.log('⚠️ Aucun userId fourni à la connexion');
    }
  }

  handleDisconnect(client: Socket) {
    console.log('❌ Un utilisateur s’est déconnecté');
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { room: string; senderId: string; receiverId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { room, senderId, receiverId } = data;

    client.join(room);
    console.log(`🔗 Client ${client.id} rejoint la room ${data.room}`);

    const messages = await this.chatService.getMessagesBetween(senderId, receiverId);

    client.emit('chatHistory', messages);

  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: ChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.chatService.createMessage(data);

    // ✅ Emettre à TOUTE la room partagée
    const room = [data.senderId, data.receiverId].sort().join('-');
    this.server.to(room).emit('receiveMessage', message);

    console.log(`💬 Message envoyé dans la room ${room}`);
    return message;
  }
}
