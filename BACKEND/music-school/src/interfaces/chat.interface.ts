export interface Chat {
  senderId: string;
  receiverId: string;
  message: string;
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
