"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_module_1 = require("./database/database.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const accounts_module_1 = require("./accounts/accounts.module");
const transactions_module_1 = require("./transactions/transactions.module");
const audit_module_1 = require("./audit/audit.module");
const exchange_module_1 = require("./exchange/exchange.module");
const transaction_limits_module_1 = require("./transactions/transaction-limits.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            database_module_1.DatabaseModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            accounts_module_1.AccountsModule,
            transactions_module_1.TransactionsModule,
            audit_module_1.AuditModule,
            exchange_module_1.ExchangeModule,
            transaction_limits_module_1.TransactionLimitsModule
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map