import { DatabaseService } from '../database/database.service';
import { ExchangeService } from '../exchange/exchange.service';

export class TransactionLimitsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly exchangeService: ExchangeService,
  ) {}

  async getLimits(userId: number):Promise<any> {
    const query = `
      SELECT * FROM transaction_limits 
      WHERE user_id = $1
    `;
    const result = await this.databaseService.query(query, [userId]);
    return result.rows[0];
  }

  async checkDailyLimit(userId: number, amount: number, currency: string): Promise<boolean> {
    const limits = await this.getLimits(userId);
    if (!limits) return true; // Limit tanımlanmamışsa işleme izin ver

    const convertedAmount:number = await this.exchangeService.convertAmount(
      amount,
      currency,
      limits.currency
    );

    const dailyQuery = `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM transactions t
      JOIN accounts a ON t.sender_account_id = a.id
      WHERE a.user_id = $1
      AND t.created_at >= CURRENT_DATE
      AND t.status = 'completed'
    `;

    const result = await this.databaseService.query(dailyQuery, [userId]);
    const dailyTotal:number = parseFloat(result.rows[0].total);

    return (dailyTotal + convertedAmount) <= limits.daily_limit;
  }

  async checkWeeklyLimit(userId: number, amount: number, currency: string): Promise<boolean> {
    const limits = await this.getLimits(userId);
    if (!limits) return true;

    const convertedAmount:number = await this.exchangeService.convertAmount(
      amount,
      currency,
      limits.currency
    );

    const weeklyQuery = `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM transactions t
      JOIN accounts a ON t.sender_account_id = a.id
      WHERE a.user_id = $1
      AND t.created_at >= CURRENT_DATE - INTERVAL '7 days'
      AND t.status = 'completed'
    `;

    const result = await this.databaseService.query(weeklyQuery, [userId]);
    const weeklyTotal:number = parseFloat(result.rows[0].total);

    return (weeklyTotal + convertedAmount) <= limits.weekly_limit;
  }

  async checkMonthlyLimit(userId: number, amount: number, currency: string): Promise<boolean> {
    const limits = await this.getLimits(userId);
    if (!limits) return true;

    const convertedAmount:number = await this.exchangeService.convertAmount(
      amount,
      currency,
      limits.currency
    );

    const monthlyQuery = `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM transactions t
      JOIN accounts a ON t.sender_account_id = a.id
      WHERE a.user_id = $1
      AND t.created_at >= CURRENT_DATE - INTERVAL '30 days'
      AND t.status = 'completed'
    `;

    const result = await this.databaseService.query(monthlyQuery, [userId]);
    const monthlyTotal:number = parseFloat(result.rows[0].total);

    return (monthlyTotal + convertedAmount) <= limits.monthly_limit;
  }

  async checkSingleTransactionLimit(userId: number, amount: number, currency: string): Promise<boolean> {
    const limits = await this.getLimits(userId);
    if (!limits) return true;

    const convertedAmount:number = await this.exchangeService.convertAmount(
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
  }):Promise<void> {
    const fields = [];
    const values = [];
    let paramCount:number = 1;

    Object.entries(limits).forEach(([key, value]):void => {
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
      VALUES ($${paramCount}, ${values.slice(0, -1).map((_, i):string => `$${i + 1}`).join(', ')})
      ON CONFLICT (user_id) DO UPDATE SET
      ${fields.join(', ')}
    `;

    await this.databaseService.query(query, values);
  }
} 