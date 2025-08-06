import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Annonce, AnnonceSchema } from 'src/schema/annonce.schema';
import { AnnonceService } from './annonce.service';
import { AnnonceController } from './annonce.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Annonce.name, schema: AnnonceSchema }]),
  ],
  controllers: [AnnonceController],
  providers: [AnnonceService],
  exports: [AnnonceService],
})
export class AnnonceModule {}