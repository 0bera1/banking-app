import {DatabaseService} from './database/database.service';
import {UsersService} from './users/users.service';
import {AuthService} from './auth/auth.service';
import {ExchangeService} from './exchange/exchange.service';
import {AccountService} from './accounts/accounts.service';
import {TransactionsService} from './transactions/transactions.service';
import {TransactionLimitsService} from './transactions/transaction-limits.service';
import {AuditService} from './audit/audit.service';
import {JwtService} from '@nestjs/jwt';
import {AppService} from './app.service';
import {AccountRepository} from './accounts/repositories/account.repository';
import {AccountValidator} from './accounts/validators/account.validator';

const databaseService = new DatabaseService();
const usersService = new UsersService(databaseService);
const jwtService = new JwtService({ secret: process.env.JWT_SECRET || 'your-secret-key' });
const authService = new AuthService(usersService, jwtService);
const exchangeService = new ExchangeService(databaseService);

const accountRepository = new AccountRepository(databaseService);
const accountValidator = new AccountValidator(accountRepository);
const accountService = new AccountService(accountRepository, usersService, accountValidator);

const auditService = new AuditService(databaseService);
const transactionLimitsService = new TransactionLimitsService(databaseService, exchangeService);
const transactionsService = new TransactionsService(databaseService,
                                                    exchangeService,
                                                    auditService,
                                                    transactionLimitsService
);
const appService = new AppService();

export function createAccountService(
    databaseService: DatabaseService,
    usersService: UsersService
): AccountService {
    const accountRepository = new AccountRepository(databaseService);
    const accountValidator = new AccountValidator(accountRepository);
    return new AccountService(accountRepository, usersService, accountValidator);
}

export function createAppService(
    databaseService: DatabaseService,
    usersService: UsersService,
    exchangeService: ExchangeService
) {
    const accountService = createAccountService(databaseService, usersService);
    return {
        databaseService,
        usersService,
        accountService,
        exchangeService
    };
}

export {databaseService,
        usersService,
        jwtService,
        authService,
        exchangeService,
        accountService,
        auditService,
        transactionLimitsService,
        transactionsService,
        appService
}; 