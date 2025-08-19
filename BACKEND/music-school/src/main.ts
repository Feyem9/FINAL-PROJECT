import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Create uploads directory if it doesn't exist
  const uploadDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));


  app.enableCors(); // 👈 Ajoute cette ligne

  const config = new DocumentBuilder()
    .setTitle('Museschool API')
    .setDescription('The Museschool API description')
    .setVersion('1.0')
    .addTag('museschool')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
