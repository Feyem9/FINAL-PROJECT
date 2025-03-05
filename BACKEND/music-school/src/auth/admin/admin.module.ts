import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../../schema/admin.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }])],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [MongooseModule , AdminService] // �� EXPORTER POUR LES AUTRES MODULES
})
export class AdminModule {}
