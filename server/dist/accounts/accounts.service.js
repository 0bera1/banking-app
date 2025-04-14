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
let AccountsService = class AccountsService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async create(createAccountDto) {
        const { card_number, card_holder_name, card_brand, card_issuer, card_type, initial_balance } = createAccountDto;
        const query = `
            INSERT INTO accounts 
            (card_number, card_holder_name, card_brand, card_issuer, card_type, balance)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [
            card_number,
            card_holder_name,
            card_brand,
            card_issuer,
            card_type,
            initial_balance || 0
        ];
        const result = await this.databaseService.query(query, values);
        return result.rows[0];
    }
    async remove(id) {
        const query = 'DELETE FROM accounts WHERE id = $1';
        await this.databaseService.query(query, [id]);
    }
    async findOne(id) {
        const query = 'SELECT * FROM accounts WHERE id = $1';
        const result = await this.databaseService.query(query, [id]);
        return result.rows[0];
    }
    async findByCardNumber(cardNumber) {
        const query = 'SELECT * FROM accounts WHERE card_number = $1';
        const result = await this.databaseService.query(query, [cardNumber]);
        return result.rows[0];
    }
    async updateBalance(id, amount) {
        const query = `
            UPDATE accounts 
            SET balance = balance + $2
            WHERE id = $1
            RETURNING *
        `;
        const result = await this.databaseService.query(query, [id, amount]);
        return result.rows[0];
    }
    async updateStatus(id, status) {
        const query = `
            UPDATE accounts 
            SET status = $2
            WHERE id = $1
            RETURNING *
        `;
        const result = await this.databaseService.query(query, [id, status]);
        return result.rows[0];
    }
};
exports.AccountsService = AccountsService;
exports.AccountsService = AccountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], AccountsService);
//# sourceMappingURL=accounts.service.js.map