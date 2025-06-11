import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from 'src/interfaces/notification';



@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification') private readonly notificationModel: Model<Notification>,
  ) {}

  // Créer une notification
  async create(user_id: string, title: string, message: string): Promise<Notification> {
    const notif = new this.notificationModel({
      user_id,
      title,
      message,
      read: false,
      createdAt: new Date(),
    });
    return await notif.save();
  }

  // Récupérer toutes les notifications d'un utilisateur
  async findAllForUser(user_id: string): Promise<Notification[]> {
    return await this.notificationModel.find({ user_id }).sort({ createdAt: -1 }).exec();
  }

    // Récupérer toutes les notifications du site
    async findAll(): Promise<Notification[]> {
    return await this.notificationModel.find().sort({ createdAt: -1 }).exec();
  }

//   // Marquer une notification comme lue
//   async markAsRead(notificationId: string): Promise<Notification> {
//     const notif = await this.notificationModel.findByIdAndUpdate(
//       notificationId,
//       { read: true },
//       { new: true }
//     );
//     if (!notif) throw new NotFoundException('Notification not found');
//     return notif;
//   }

// Marquer une notification comme lue ou non lue
async markAsRead(notificationId: string, read: boolean): Promise<Notification> {
  const notif = await this.notificationModel.findByIdAndUpdate(
    notificationId,
    { read },
    { new: true }
  );
  if (!notif) throw new NotFoundException('Notification not found');
  return notif;
}

  // Supprimer une notification
  async delete(notificationId: string): Promise<void> {
    await this.notificationModel.findByIdAndDelete(notificationId);
  }
}
