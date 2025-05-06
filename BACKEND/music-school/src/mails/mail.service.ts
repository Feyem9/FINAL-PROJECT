import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(to: string, name: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Bienvenue sur Museschool 🎵',
      template: './welcome', // Nom du fichier Handlebars (sans .hbs)
      context: { name }, // Variables du template
    });
  }
}
