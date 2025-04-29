// NestJS uygulama fabrikasını import ediyoruz
import { NestFactory } from '@nestjs/core';
// Ana uygulama modülünü import ediyoruz
import { AppModule } from './app.module';
import {INestApplication} from "@nestjs/common";

async function bootstrap(): Promise<void> {
  const app:INestApplication<any> = await NestFactory.create(AppModule);
  // CORS'u etkinleştiriyoruz (farklı domainlerden gelen isteklere izin veriyoruz)
  app.enableCors();
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
