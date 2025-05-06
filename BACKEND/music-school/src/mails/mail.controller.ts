import { Controller, Get, Query } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('send')
  async sendEmail(@Query('to') to: string, @Query('name') name: string) {
    await this.mailService.sendWelcomeEmail(to, name);
    return { message: 'Email envoyé avec succès' };
  }
}
