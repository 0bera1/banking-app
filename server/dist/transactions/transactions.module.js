"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsModule = void 0;
const common_1 = require("@nestjs/common");
const transactions_service_1 = require("./transactions.service");
const transactions_controller_1 = require("./transactions.controller");
const database_service_1 = require("../database/database.service");
const exchange_service_1 = require("../exchange/exchange.service");
const audit_service_1 = require("../audit/audit.service");
const transaction_limits_service_1 = require("./transaction-limits.service");
const databaseService = new database_service_1.DatabaseService();
const exchangeService = new exchange_service_1.ExchangeService(databaseService);
const auditService = new audit_service_1.AuditService(databaseService);
const transactionLimitsService = new transaction_limits_service_1.TransactionLimitsService(databaseService, exchangeService);
const transactionsServiceInstance = new transactions_service_1.TransactionsService(databaseService, exchangeService, auditService, transactionLimitsService);
let TransactionsModule = class TransactionsModule {
};
exports.TransactionsModule = TransactionsModule;
exports.TransactionsModule = TransactionsModule = __decorate([
    (0, common_1.Module)({
        controllers: [transactions_controller_1.TransactionsController],
        providers: [
            {
                provide: database_service_1.DatabaseService,
                useValue: databaseService
            },
            {
                provide: transactions_service_1.TransactionsService,
                useValue: transactionsServiceInstance
            },
            exchange_service_1.ExchangeService,
            audit_service_1.AuditService,
            transaction_limits_service_1.TransactionLimitsService
        ],
        exports: [transactions_service_1.TransactionsService]
    })
], TransactionsModule);
//# sourceMappingURL=transactions.module.js.map