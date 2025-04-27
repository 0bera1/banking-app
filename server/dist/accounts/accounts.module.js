"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsModule = void 0;
const common_1 = require("@nestjs/common");
const accounts_service_1 = require("./accounts.service");
const accounts_controller_1 = require("./accounts.controller");
const database_service_1 = require("../database/database.service");
const users_service_1 = require("../users/users.service");
const exchange_service_1 = require("../exchange/exchange.service");
const accountsServiceInstance = new accounts_service_1.AccountsService(new database_service_1.DatabaseService(), new users_service_1.UsersService(new database_service_1.DatabaseService()), new exchange_service_1.ExchangeService(new database_service_1.DatabaseService()));
let AccountsModule = class AccountsModule {
};
exports.AccountsModule = AccountsModule;
exports.AccountsModule = AccountsModule = __decorate([
    (0, common_1.Module)({
        controllers: [accounts_controller_1.AccountsController],
        providers: [
            {
                provide: accounts_service_1.AccountsService,
                useValue: accountsServiceInstance,
            },
            database_service_1.DatabaseService,
            users_service_1.UsersService,
            exchange_service_1.ExchangeService,
        ],
        exports: [accounts_service_1.AccountsService],
    })
], AccountsModule);
//# sourceMappingURL=accounts.module.js.map