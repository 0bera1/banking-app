// NestJS'den gerekli modülü import ediyoruz
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// Veritabanı modülünü import ediyoruz
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AuditModule } from './audit/audit.module';

// @Module decorator'u ile ana uygulama modülünü tanımlıyoruz
@Module({
  // imports: Uygulamanın ihtiyaç duyduğu diğer modülleri buraya ekliyoruz
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    AccountsModule,
    TransactionsModule,
    AuditModule
  ],
  // controllers: HTTP isteklerini işleyecek controller'ları buraya ekliyoruz
  controllers: [],
  // providers: Servisleri ve diğer sağlayıcıları buraya ekliyoruz
  providers: [],
})
export class AppModule {}
