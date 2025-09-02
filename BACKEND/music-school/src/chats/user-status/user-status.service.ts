import { Injectable } from '@nestjs/common';

@Injectable()
export class UserStatusService {
    private onlineUsers = new Map<string, { socketId: string; lastSeen: Date }>();

  setUserOnline(userId: string, socketId: string) {
    this.onlineUsers.set(userId, {
      socketId,
      lastSeen: new Date()
    });
  }

  setUserOffline(userId: string) {
    this.onlineUsers.delete(userId);
  }

  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }

  getOnlineUsers(): string[] {
    return Array.from(this.onlineUsers.keys());
  }

  getUserSocketId(userId: string): string | null {
    return this.onlineUsers.get(userId)?.socketId || null;
  }
}
