import { DatabaseService } from '../database/database.service';
import { ExchangeService } from '../exchange/exchange.service';
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
export declare class TransactionLimitsService {
    private readonly databaseService;
    private readonly exchangeService;
    constructor(databaseService: DatabaseService, exchangeService: ExchangeService);
    getLimits(userId: number): Promise<TransactionLimit>;
    getDailyTotal(userId: number, currency: string): Promise<number>;
    getWeeklyTotal(userId: number, currency: string): Promise<number>;
    getMonthlyTotal(userId: number, currency: string): Promise<number>;
    checkDailyLimit(userId: number, amount: number, currency: string): Promise<boolean>;
    checkWeeklyLimit(userId: number, amount: number, currency: string): Promise<boolean>;
    checkMonthlyLimit(userId: number, amount: number, currency: string): Promise<boolean>;
    checkSingleTransactionLimit(userId: number, amount: number, currency: string): Promise<boolean>;
    updateLimits(userId: number, limits: {
        daily_limit?: number;
        weekly_limit?: number;
        monthly_limit?: number;
        single_transaction_limit?: number;
        currency?: string;
    }): Promise<void>;
}
export {};
