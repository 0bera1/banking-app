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
const accounts_controller_1 = require("./accounts.controller");
const accounts_service_1 = require("./accounts.service");
const account_repository_1 = require("./repositories/account.repository");
const account_validator_1 = require("./validators/account.validator");
const database_module_1 = require("../database/database.module");
const users_module_1 = require("../users/users.module");
const deposit_handler_1 = require("./handlers/deposit-handler");
const withdraw_handler_1 = require("./handlers/withdraw-handler");
const create_account_handler_1 = require("./handlers/create-account-handler");
const get_account_handler_1 = require("./handlers/get-account-handler");
const delete_account_handler_1 = require("./handlers/delete-account-handler");
const get_balance_handler_1 = require("./handlers/get-balance-handler");
const verify_iban_handler_1 = require("./handlers/verify-iban-handler");
const update_status_handler_1 = require("./handlers/update-status-handler");
let AccountsModule = class AccountsModule {
};
exports.AccountsModule = AccountsModule;
exports.AccountsModule = AccountsModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, users_module_1.UsersModule],
        controllers: [accounts_controller_1.AccountsController],
        providers: [
            {
                provide: 'IAccountService',
                useClass: accounts_service_1.AccountService
            },
            {
                provide: 'IAccountRepository',
                useClass: account_repository_1.AccountRepository
            },
            {
                provide: 'IAccountValidator',
                useClass: account_validator_1.AccountValidator
            },
            deposit_handler_1.DepositHandler,
            withdraw_handler_1.WithdrawHandler,
            create_account_handler_1.CreateAccountHandler,
            get_account_handler_1.GetAccountHandler,
            delete_account_handler_1.DeleteAccountHandler,
            get_balance_handler_1.GetBalanceHandler,
            verify_iban_handler_1.VerifyIbanHandler,
            update_status_handler_1.UpdateStatusHandler
        ],
        exports: ['IAccountService']
    })
], AccountsModule);
//# sourceMappingURL=accounts.module.js.map