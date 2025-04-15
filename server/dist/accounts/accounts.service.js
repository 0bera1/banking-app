"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const users_service_1 = require("../users/users.service");
const exchange_service_1 = require("../exchange/exchange.service");
let AccountsService = class AccountsService {
    constructor(databaseService, usersService, exchangeService) {
        this.databaseService = databaseService;
        this.usersService = usersService;
        this.exchangeService = exchangeService;
    }
    async create(createAccountDto) {
        try {
            console.log('Creating account with data:', createAccountDto);
            const user = await this.usersService.findOne(createAccountDto.user_id);
            if (!user) {
                throw new common_1.NotFoundException('Kullanıcı bulunamadı');
            }
            const query = `
                INSERT INTO accounts 
                (card_number, card_holder_name, card_brand, card_issuer, card_type, balance, user_id, currency)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
            `;
            const values = [
                createAccountDto.cardNumber,
                createAccountDto.cardHolderName,
                createAccountDto.cardBrand,
                createAccountDto.cardIssuer,
                createAccountDto.cardType,
                createAccountDto.initialBalance || 0,
                createAccountDto.user_id,
                createAccountDto.currency || 'TRY'
            ];
            console.log('Executing query:', query);
            console.log('With values:', values);
            const result = await this.databaseService.query(query, values);
            console.log('Query result:', result);
            return result.rows[0];
        }
        catch (error) {
            console.error('Error in create:', error);
            throw error;
        }
    }
    async remove(id, user_id) {
        const account = await this.findOne(id);
        if (!account) {
            throw new common_1.NotFoundException('Hesap bulunamadı');
        }
        if (account.user_id !== user_id) {
            throw new common_1.BadRequestException('Bu hesap üzerinde işlem yapmaya yetkiniz yok');
        }
        const query = 'DELETE FROM accounts WHERE id = $1 AND user_id = $2';
        await this.databaseService.query(query, [id, user_id]);
    }
    async findOne(id) {
        const query = 'SELECT * FROM accounts WHERE id = $1';
        const result = await this.databaseService.query(query, [id]);
        return result.rows[0];
    }
    async findByUserId(user_id) {
        const query = 'SELECT * FROM accounts WHERE user_id = $1';
        const result = await this.databaseService.query(query, [user_id]);
        return result.rows;
    }
    async findByCardNumber(cardNumber) {
        const query = 'SELECT * FROM accounts WHERE card_number = $1';
        const result = await this.databaseService.query(query, [cardNumber]);
        return result.rows[0];
    }
    async updateBalance(id, amount, user_id) {
        const account = await this.findOne(id);
        if (!account) {
            throw new common_1.NotFoundException('Hesap bulunamadı');
        }
        if (account.user_id !== user_id) {
            throw new common_1.BadRequestException('Bu hesap üzerinde işlem yapmaya yetkiniz yok');
        }
        const query = `
            UPDATE accounts 
            SET balance = balance + $1
            WHERE id = $2 AND user_id = $3
            RETURNING *
        `;
        const result = await this.databaseService.query(query, [amount, id, user_id]);
        return result.rows[0];
    }
    async updateStatus(id, status, user_id) {
        const account = await this.findOne(id);
        if (!account) {
            throw new common_1.NotFoundException('Hesap bulunamadı');
        }
        if (account.user_id !== user_id) {
            throw new common_1.BadRequestException('Bu hesap üzerinde işlem yapmaya yetkiniz yok');
        }
        const query = `
            UPDATE accounts 
            SET status = $1
            WHERE id = $2 AND user_id = $3
            RETURNING *
        `;
        const result = await this.databaseService.query(query, [status, id, user_id]);
        return result.rows[0];
    }
    async findAll() {
        const query = 'SELECT * FROM accounts';
        const result = await this.databaseService.query(query);
        return result.rows;
    }
    async deposit(id, amount) {
        if (amount <= 0) {
            throw new common_1.BadRequestException('Amount must be positive');
        }
        const query = `
            UPDATE accounts 
            SET balance = balance + $1 
            WHERE id = $2 
            RETURNING *
        `;
        const result = await this.databaseService.query(query, [amount, id]);
        if (result.rows.length === 0) {
            throw new common_1.NotFoundException('Account not found');
        }
        return result.rows[0];
    }
    async withdraw(id, amount) {
        if (amount <= 0) {
            throw new common_1.BadRequestException('Amount must be positive');
        }
        const client = await this.databaseService.getClient();
        try {
            await client.query('BEGIN');
            const checkQuery = 'SELECT * FROM accounts WHERE id = $1 FOR UPDATE';
            const checkResult = await client.query(checkQuery, [id]);
            if (checkResult.rows.length === 0) {
                throw new common_1.NotFoundException('Account not found');
            }
            const account = checkResult.rows[0];
            if (account.balance < amount) {
                throw new common_1.BadRequestException('Insufficient balance');
            }
            const updateQuery = `
                UPDATE accounts 
                SET balance = balance - $1 
                WHERE id = $2 
                RETURNING *
            `;
            const result = await client.query(updateQuery, [amount, id]);
            await client.query('COMMIT');
            return result.rows[0];
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    async getBalance(id, currency) {
        const account = await this.findOne(id);
        if (!account) {
            throw new Error('Hesap bulunamadı');
        }
        if (!currency || currency === account.currency) {
            return { balance: account.balance, currency: account.currency };
        }
        const convertedBalance = await this.exchangeService.convertAmount(account.balance, account.currency, currency);
        return { balance: convertedBalance, currency };
    }
};
exports.AccountsService = AccountsService;
exports.AccountsService = AccountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        users_service_1.UsersService,
        exchange_service_1.ExchangeService])
], AccountsService);
//# sourceMappingURL=accounts.service.js.map