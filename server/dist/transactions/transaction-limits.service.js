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
exports.TransactionLimitsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const exchange_service_1 = require("../exchange/exchange.service");
let TransactionLimitsService = class TransactionLimitsService {
    constructor(databaseService, exchangeService) {
        this.databaseService = databaseService;
        this.exchangeService = exchangeService;
    }
    async getLimits(userId) {
        const query = `
      SELECT * FROM transaction_limits 
      WHERE user_id = $1
    `;
        const result = await this.databaseService.query(query, [userId]);
        return result.rows[0];
    }
    async checkDailyLimit(userId, amount, currency) {
        const limits = await this.getLimits(userId);
        if (!limits)
            return true;
        const convertedAmount = await this.exchangeService.convertAmount(amount, currency, limits.currency);
        const dailyQuery = `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM transactions t
      JOIN accounts a ON t.sender_account_id = a.id
      WHERE a.user_id = $1
      AND t.created_at >= CURRENT_DATE
      AND t.status = 'completed'
    `;
        const result = await this.databaseService.query(dailyQuery, [userId]);
        const dailyTotal = parseFloat(result.rows[0].total);
        return (dailyTotal + convertedAmount) <= limits.daily_limit;
    }
    async checkWeeklyLimit(userId, amount, currency) {
        const limits = await this.getLimits(userId);
        if (!limits)
            return true;
        const convertedAmount = await this.exchangeService.convertAmount(amount, currency, limits.currency);
        const weeklyQuery = `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM transactions t
      JOIN accounts a ON t.sender_account_id = a.id
      WHERE a.user_id = $1
      AND t.created_at >= CURRENT_DATE - INTERVAL '7 days'
      AND t.status = 'completed'
    `;
        const result = await this.databaseService.query(weeklyQuery, [userId]);
        const weeklyTotal = parseFloat(result.rows[0].total);
        return (weeklyTotal + convertedAmount) <= limits.weekly_limit;
    }
    async checkMonthlyLimit(userId, amount, currency) {
        const limits = await this.getLimits(userId);
        if (!limits)
            return true;
        const convertedAmount = await this.exchangeService.convertAmount(amount, currency, limits.currency);
        const monthlyQuery = `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM transactions t
      JOIN accounts a ON t.sender_account_id = a.id
      WHERE a.user_id = $1
      AND t.created_at >= CURRENT_DATE - INTERVAL '30 days'
      AND t.status = 'completed'
    `;
        const result = await this.databaseService.query(monthlyQuery, [userId]);
        const monthlyTotal = parseFloat(result.rows[0].total);
        return (monthlyTotal + convertedAmount) <= limits.monthly_limit;
    }
    async checkSingleTransactionLimit(userId, amount, currency) {
        const limits = await this.getLimits(userId);
        if (!limits)
            return true;
        const convertedAmount = await this.exchangeService.convertAmount(amount, currency, limits.currency);
        return convertedAmount <= limits.single_transaction_limit;
    }
    async updateLimits(userId, limits) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        Object.entries(limits).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });
        if (fields.length === 0)
            return;
        values.push(userId);
        const query = `
      INSERT INTO transaction_limits (user_id, ${Object.keys(limits).join(', ')})
      VALUES ($${paramCount}, ${values.slice(0, -1).map((_, i) => `$${i + 1}`).join(', ')})
      ON CONFLICT (user_id) DO UPDATE SET
      ${fields.join(', ')}
    `;
        await this.databaseService.query(query, values);
    }
};
exports.TransactionLimitsService = TransactionLimitsService;
exports.TransactionLimitsService = TransactionLimitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        exchange_service_1.ExchangeService])
], TransactionLimitsService);
//# sourceMappingURL=transaction-limits.service.js.map