import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { DatabaseService } from '../database/database.service';
import { UsersService } from '../users/users.service';
import { ExchangeService } from '../exchange/exchange.service';

const accountsServiceInstance = new AccountsService(
  new DatabaseService(),
  new UsersService(new DatabaseService()),
  new ExchangeService(new DatabaseService())
);

@Module({
    controllers: [AccountsController],
    providers: [
      {
        provide: AccountsService,
        useValue: accountsServiceInstance,
      },
      DatabaseService,
      UsersService,
      ExchangeService,
    ],
    exports: [AccountsService],
})
export class AccountsModule {}
