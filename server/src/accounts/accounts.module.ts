import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { ExchangeModule } from '../exchange/exchange.module';

@Module({
    imports: [DatabaseModule, UsersModule, ExchangeModule],
    controllers: [AccountsController],
    providers: [AccountsService],
    exports: [AccountsService],
})
export class AccountsModule {}
