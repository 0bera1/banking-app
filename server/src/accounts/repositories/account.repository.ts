import { DatabaseService, QueryResult } from '../../database/database.service';
import { AccountRepositoryContract } from '../interfaces/account.interface';
import { AccountResponse } from '../dto/account-response.dto';
import { CreateAccountDto } from '../dto/create-account.dto';

interface AccountRow {
    id: number;
    user_id: number;
    account_number: string;
    balance: number;
    currency: string;
    status: string;
    iban: string;
    created_at: Date;
    updated_at: Date;
}

export class AccountRepository implements AccountRepositoryContract {
    constructor(private readonly databaseService: DatabaseService) {}

    private mapToAccountResponse(row: AccountRow): AccountResponse {
        return {
            id: row.id,
            userId: row.user_id,
            accountNumber: row.account_number,
            balance: row.balance,
            currency: row.currency,
            status: row.status,
            iban: row.iban,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }

    async getBalance(id: number, currency?: string): Promise<{ balance: number; currency: string }> {
        const result = await this.databaseService.query<AccountRow>(
            'SELECT balance, currency FROM accounts WHERE id = $1',
            [id]
        );
        return {
            balance: result.rows[0].balance,
            currency: result.rows[0].currency
        };
    }

    async updateBalance(id: number, amount: number): Promise<AccountResponse> {
        const result = await this.databaseService.query<AccountRow>(
            'UPDATE accounts SET balance = balance + $1 WHERE id = $2 RETURNING *',
            [amount, id]
        );
        return this.mapToAccountResponse(result.rows[0]);
    }

    async create(userId: number, initialBalance: number, currency: string): Promise<AccountResponse> {
        const result = await this.databaseService.query<AccountRow>(
            `INSERT INTO accounts (user_id, balance, currency, status, iban)
             VALUES ($1, $2, $3, 'active', $4)
             RETURNING *`,
            [userId, initialBalance, currency, this.generateIban()]
        );
        return this.mapToAccountResponse(result.rows[0]);
    }

    async remove(id: number, userId: number): Promise<void> {
        await this.databaseService.query(
            'DELETE FROM accounts WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
    }

    async findOne(id: number): Promise<AccountResponse> {
        const result = await this.databaseService.query<AccountRow>(
            'SELECT * FROM accounts WHERE id = $1',
            [id]
        );
        return this.mapToAccountResponse(result.rows[0]);
    }

    async findByUserId(userId: number): Promise<AccountResponse[]> {
        const result = await this.databaseService.query<AccountRow>(
            'SELECT * FROM accounts WHERE user_id = $1',
            [userId]
        );
        return result.rows.map(row => this.mapToAccountResponse(row));
    }

    async findByCardNumber(cardNumber: string): Promise<AccountResponse> {
        const result = await this.databaseService.query<AccountRow>(
            'SELECT * FROM accounts WHERE account_number = $1',
            [cardNumber]
        );
        return this.mapToAccountResponse(result.rows[0]);
    }

    async updateStatus(id: number, status: string, userId: number): Promise<AccountResponse> {
        const result = await this.databaseService.query<AccountRow>(
            'UPDATE accounts SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [status, id, userId]
        );
        return this.mapToAccountResponse(result.rows[0]);
    }

    async findAll(): Promise<AccountResponse[]> {
        const result = await this.databaseService.query<AccountRow>(
            'SELECT * FROM accounts'
        );
        return result.rows.map(row => this.mapToAccountResponse(row));
    }

    async deposit(id: number, amount: number, userId: number): Promise<AccountResponse> {
        const result = await this.databaseService.query<AccountRow>(
            'UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [amount, id, userId]
        );
        return this.mapToAccountResponse(result.rows[0]);
    }

    async withdraw(id: number, amount: number, userId: number): Promise<AccountResponse> {
        const result = await this.databaseService.query<AccountRow>(
            'UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [amount, id, userId]
        );
        return this.mapToAccountResponse(result.rows[0]);
    }

    async findByIban(iban: string): Promise<AccountResponse> {
        const result = await this.databaseService.query<AccountRow>(
            'SELECT * FROM accounts WHERE iban = $1',
            [iban]
        );
        return this.mapToAccountResponse(result.rows[0]);
    }

    private generateIban(): string {
        const countryCode = 'TR';
        const bankCode = '00';
        const randomNumber = Math.floor(Math.random() * 1000000000000000).toString().padStart(14, '0');
        return `${countryCode}${bankCode}${randomNumber}`;
    }
} 