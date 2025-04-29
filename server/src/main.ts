// NestJS uygulama fabrikasını import ediyoruz
import { NestFactory } from '@nestjs/core';
// Ana uygulama modülünü import ediyoruz
import { AppModule } from './app.module';
import {INestApplication} from "@nestjs/common";

// Uygulamayı başlatan asenkron fonksiyon
async function bootstrap(): Promise<void> {
  // NestJS uygulamasını oluşturuyoruz
  const app:INestApplication<any> = await NestFactory.create(AppModule);
  // CORS'u etkinleştiriyoruz (farklı domainlerden gelen isteklere izin veriyoruz)
  app.enableCors();
  // Uygulamayı 3000 portunda dinlemeye başlıyoruz
  await app.listen(3000);
  // Başlangıç mesajını konsola yazdırıyoruz
  console.log('Application is running on: http://localhost:3000');
}
// Uygulamayı başlatıyoruz
bootstrap();
