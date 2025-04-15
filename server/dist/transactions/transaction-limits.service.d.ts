import { DatabaseService } from '../database/database.service';
import { ExchangeService } from '../exchange/exchange.service';
export declare class TransactionLimitsService {
    private readonly databaseService;
    private readonly exchangeService;
    constructor(databaseService: DatabaseService, exchangeService: ExchangeService);
    getLimits(userId: number): Promise<any>;
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
