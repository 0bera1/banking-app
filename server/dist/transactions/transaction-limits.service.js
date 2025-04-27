"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionLimitsService = void 0;
class TransactionLimitsService {
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
}
exports.TransactionLimitsService = TransactionLimitsService;
//# sourceMappingURL=transaction-limits.service.js.map