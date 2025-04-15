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
import { ExchangeModule } from './exchange/exchange.module';
import { TransactionLimitsModule } from './transactions/transaction-limits.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    AccountsModule,
    TransactionsModule,
    AuditModule,
    ExchangeModule,
    TransactionLimitsModule
  ],
  // HTTP İstekleri buraya eklenecek
  controllers: [],
  // providers: Servisleri ve diğer sağlayıcılar
  providers: [],
})
export class AppModule {}
