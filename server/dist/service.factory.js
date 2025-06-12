"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appService = exports.transactionsService = exports.transactionLimitsService = exports.auditService = exports.accountService = exports.exchangeService = exports.authService = exports.jwtService = exports.usersService = exports.databaseService = void 0;
exports.createAccountService = createAccountService;
exports.createAppService = createAppService;
const database_service_1 = require("./database/database.service");
const users_service_1 = require("./users/users.service");
const auth_service_1 = require("./auth/auth.service");
const exchange_service_1 = require("./exchange/exchange.service");
const accounts_service_1 = require("./accounts/accounts.service");
const transactions_service_1 = require("./transactions/transactions.service");
const transaction_limits_service_1 = require("./transactions/transaction-limits.service");
const audit_service_1 = require("./audit/audit.service");
const jwt_1 = require("@nestjs/jwt");
const app_service_1 = require("./app.service");
const account_repository_1 = require("./accounts/repositories/account.repository");
const account_validator_1 = require("./accounts/validators/account.validator");
const databaseService = new database_service_1.DatabaseService();
exports.databaseService = databaseService;
const usersService = new users_service_1.UsersService(databaseService);
exports.usersService = usersService;
const jwtService = new jwt_1.JwtService({ secret: process.env.JWT_SECRET || 'your-secret-key' });
exports.jwtService = jwtService;
const authService = new auth_service_1.AuthService(usersService, jwtService);
exports.authService = authService;
const exchangeService = new exchange_service_1.ExchangeService(databaseService);
exports.exchangeService = exchangeService;
const accountRepository = new account_repository_1.AccountRepository(databaseService);
const accountValidator = new account_validator_1.AccountValidator(accountRepository);
const accountService = new accounts_service_1.AccountService(accountRepository, usersService, accountValidator);
exports.accountService = accountService;
const auditService = new audit_service_1.AuditService(databaseService);
exports.auditService = auditService;
const transactionLimitsService = new transaction_limits_service_1.TransactionLimitsService(databaseService, exchangeService);
exports.transactionLimitsService = transactionLimitsService;
const transactionsService = new transactions_service_1.TransactionsService(databaseService, exchangeService, auditService, transactionLimitsService);
exports.transactionsService = transactionsService;
const appService = new app_service_1.AppService();
exports.appService = appService;
function createAccountService(databaseService, usersService) {
    const accountRepository = new account_repository_1.AccountRepository(databaseService);
    const accountValidator = new account_validator_1.AccountValidator(accountRepository);
    return new accounts_service_1.AccountService(accountRepository, usersService, accountValidator);
}
function createAppService(databaseService, usersService, exchangeService) {
    const accountService = createAccountService(databaseService, usersService);
    return {
        databaseService,
        usersService,
        accountService,
        exchangeService
    };
}
//# sourceMappingURL=service.factory.js.map