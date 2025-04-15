"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionLimitsModule = void 0;
const common_1 = require("@nestjs/common");
const transaction_limits_service_1 = require("./transaction-limits.service");
const database_module_1 = require("../database/database.module");
const exchange_module_1 = require("../exchange/exchange.module");
let TransactionLimitsModule = class TransactionLimitsModule {
};
exports.TransactionLimitsModule = TransactionLimitsModule;
exports.TransactionLimitsModule = TransactionLimitsModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, exchange_module_1.ExchangeModule],
        providers: [transaction_limits_service_1.TransactionLimitsService],
        exports: [transaction_limits_service_1.TransactionLimitsService],
    })
], TransactionLimitsModule);
//# sourceMappingURL=transaction-limits.module.js.map