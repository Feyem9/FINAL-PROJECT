import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MusicResourcesController } from './resource.controller';
import { MusicResourcesService } from './resource.service';
import { MusicResource, MusicResourceSchema } from '../../schema/resource.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MusicResource.name, schema: MusicResourceSchema }]),
  ],
  controllers: [MusicResourcesController],
  providers: [MusicResourcesService],
})
export class ResourceModule {}
