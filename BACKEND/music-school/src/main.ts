import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
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

  // Add global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

 app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://final-project-rhl2-git-main-christians-projects-9c9bef59.vercel.app'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Museschool API')
    .setDescription('The Museschool API description')
    .setVersion('1.0')
    .addTag('museschool')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // await app.listen(process.env.PORT ?? 3000);
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // 👈 obligé sur Render

  console.log(`🚀 Museschool API is running on port ${port}`);

}
bootstrap();
