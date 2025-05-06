import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../../schema/admin.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  imports: [MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]) , 
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1h' },
    }),
  }),
  MailerModule,
  ConfigModule,
],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [MongooseModule , AdminService] // �� EXPORTER POUR LES AUTRES MODULES
})
export class AdminModule {}
