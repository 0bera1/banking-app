import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ExchangeService } from '../exchange/exchange.service';
import { QueryResult } from '../database/database.service';

interface TransactionLimit {
    id: number;
    user_id: number;
    daily_limit: number;
    weekly_limit: number;
    monthly_limit: number;
    single_transaction_limit: number;
    currency: string;
    created_at: Date;
    updated_at: Date;
}

@Injectable()
export class TransactionLimitsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly exchangeService: ExchangeService
    ) {}

    async getLimits(userId: number): Promise<TransactionLimit> {
        const result = await this.databaseService.query<TransactionLimit>(
            'SELECT * FROM transaction_limits WHERE user_id = $1',
            [userId]
        );
        return result.rows[0];
    }

    async getDailyTotal(userId: number, currency: string): Promise<number> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const result = await this.databaseService.query<{ total: string }>(
            `SELECT COALESCE(SUM(amount), 0) as total 
             FROM transactions 
             WHERE user_id = $1 
             AND created_at >= $2`,
            [userId, today]
        );

        const dailyTotal: number = parseFloat(result.rows[0].total);
        return dailyTotal;
    }

    async getWeeklyTotal(userId: number, currency: string): Promise<number> {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);

        const result = await this.databaseService.query<{ total: string }>(
            `SELECT COALESCE(SUM(amount), 0) as total 
             FROM transactions 
             WHERE user_id = $1 
             AND created_at >= $2`,
            [userId, weekStart]
        );

        const weeklyTotal: number = parseFloat(result.rows[0].total);
        return weeklyTotal;
    }

    async getMonthlyTotal(userId: number, currency: string): Promise<number> {
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const result = await this.databaseService.query<{ total: string }>(
            `SELECT COALESCE(SUM(amount), 0) as total 
             FROM transactions 
             WHERE user_id = $1 
             AND created_at >= $2`,
            [userId, monthStart]
        );

        const monthlyTotal: number = parseFloat(result.rows[0].total);
        return monthlyTotal;
    }

    async checkDailyLimit(userId: number, amount: number, currency: string): Promise<boolean> {
        const limits = await this.getLimits(userId);
        const dailyTotal = await this.getDailyTotal(userId, currency);

        return dailyTotal + amount <= limits.daily_limit;
    }

    async checkWeeklyLimit(userId: number, amount: number, currency: string): Promise<boolean> {
        const limits = await this.getLimits(userId);
        const weeklyTotal = await this.getWeeklyTotal(userId, currency);

        return weeklyTotal + amount <= limits.weekly_limit;
    }

    async checkMonthlyLimit(userId: number, amount: number, currency: string): Promise<boolean> {
        const limits = await this.getLimits(userId);
        const monthlyTotal = await this.getMonthlyTotal(userId, currency);

        return monthlyTotal + amount <= limits.monthly_limit;
    }

    async checkSingleTransactionLimit(userId: number, amount: number, currency: string): Promise<boolean> {
        const limits = await this.getLimits(userId);
        if (!limits) return true;

        const convertedAmount: number = await this.exchangeService.convertAmount(
            amount,
            currency,
            limits.currency
        );

        return convertedAmount <= limits.single_transaction_limit;
    }

    async updateLimits(userId: number, limits: {
        daily_limit?: number;
        weekly_limit?: number;
        monthly_limit?: number;
        single_transaction_limit?: number;
        currency?: string;
    }): Promise<void> {
        const fields = [];
        const values = [];
        let paramCount: number = 1;

        Object.entries(limits).forEach(([key, value]): void => {
            if (value !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });

        if (fields.length === 0) return;

        values.push(userId);
        const query = `
            INSERT INTO transaction_limits (user_id, ${Object.keys(limits).join(', ')})
            VALUES ($${paramCount}, ${values.slice(0, -1).map((_, i): string => `$${i + 1}`).join(', ')})
            ON CONFLICT (user_id) DO UPDATE SET
            ${fields.join(', ')}
        `;

        await this.databaseService.query(query, values);
    }
} 