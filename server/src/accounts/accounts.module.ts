import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountService } from './accounts.service';
import { AccountRepository } from './repositories/account.repository';
import { AccountValidator } from './validators/account.validator';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { DepositHandler } from './handlers/deposit-handler';
import { WithdrawHandler } from './handlers/withdraw-handler';
import { CreateAccountHandler } from './handlers/create-account-handler';
import { GetAccountHandler } from './handlers/get-account-handler';
import { DeleteAccountHandler } from './handlers/delete-account-handler';
import { GetBalanceHandler } from './handlers/get-balance-handler';
import { VerifyIbanHandler } from './handlers/verify-iban-handler';
import { UpdateStatusHandler } from './handlers/update-status-handler';
import { UsersService } from '../users/users.service';
import { DatabaseService } from '../database/database.service';

@Module({
    imports: [DatabaseModule, UsersModule],
    controllers: [AccountsController],
    providers: [
        UsersService,
        {
            provide: 'IAccountService',
            useFactory: (repository: AccountRepository, usersService: UsersService, validator: AccountValidator) => {
                return new AccountService(repository, usersService, validator);
            },
            inject: ['IAccountRepository', UsersService, 'IAccountValidator']
        },
        {
            provide: 'IAccountRepository',
            useFactory: (databaseService: DatabaseService) => {
                return new AccountRepository(databaseService);
            },
            inject: [DatabaseService]
        },
        {
            provide: 'IAccountValidator',
            useClass: AccountValidator
        },
        DepositHandler,
        WithdrawHandler,
        CreateAccountHandler,
        GetAccountHandler,
        DeleteAccountHandler,
        GetBalanceHandler,
        VerifyIbanHandler,
        UpdateStatusHandler
    ],
    exports: ['IAccountService']
})
export class AccountsModule {}
