// NestJS'den gerekli modülü import ediyoruz
import { Module } from '@nestjs/common';
// Veritabanı servisini import ediyoruz
import { DatabaseService } from './database.service';

// @Module decorator'u ile veritabanı modülünü tanımlıyoruz
@Module({
  // providers: Bu modülde kullanılacak servisleri tanımlıyoruz
  providers: [DatabaseService],
  // exports: Bu modülden dışarıya açılacak servisleri tanımlıyoruz
  exports: [DatabaseService],
})
export class DatabaseModule {}
