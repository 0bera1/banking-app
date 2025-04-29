import {DatabaseService} from './database/database.service';
import {UsersService} from './users/users.service';
import {AuthService} from './auth/auth.service';
import {ExchangeService} from './exchange/exchange.service';
import {AccountsService} from './accounts/accounts.service';
import {TransactionsService} from './transactions/transactions.service';
import {TransactionLimitsService} from './transactions/transaction-limits.service';
import {AuditService} from './audit/audit.service';
import {JwtService} from '@nestjs/jwt';
import {AppService} from './app.service';

// Sıralı bağımlılıkları oluştur
const databaseService = new DatabaseService();
const usersService = new UsersService(databaseService);
const jwtService = new JwtService({ secret: process.env.JWT_SECRET || 'your-secret-key' });
const authService = new AuthService(usersService, jwtService);
const exchangeService = new ExchangeService(databaseService);
const accountsService = new AccountsService(databaseService, usersService, exchangeService);
const auditService = new AuditService(databaseService);
const transactionLimitsService = new TransactionLimitsService(databaseService, exchangeService);
const transactionsService = new TransactionsService(databaseService,
                                                    exchangeService,
                                                    auditService,
                                                    transactionLimitsService
);
const appService = new AppService();

export {databaseService,
        usersService,
        jwtService,
        authService,
        exchangeService,
        accountsService,
        auditService,
        transactionLimitsService,
        transactionsService,
         appService
}; 