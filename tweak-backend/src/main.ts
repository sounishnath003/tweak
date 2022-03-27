import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: [
      'http://127.0.0.1:4200',
      'http://localhost:4200',
      'https://epic-bhaskara-c90297.netlify.app',
      'http://epic-bhaskara-c90297.netlify.app',
    ],
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 1337);
}
bootstrap();
