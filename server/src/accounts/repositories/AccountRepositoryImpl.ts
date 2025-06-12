import { AccountRepository } from '../interfaces/AccountRepository';
import { CreateAccountDto } from '../dto/create-account.dto';
import { AccountResponse } from '../dto/account-response.dto';
import { DatabaseRepository } from '../../database/interfaces/database.interface';

interface QueryResult<T> {
    rows: T[];
}

export class AccountRepositoryImpl implements AccountRepository {
    private readonly db: DatabaseRepository;

    constructor(db: DatabaseRepository) {
        this.db = db;
    }

    public async create(createAccountDto: CreateAccountDto & { user_id: number }): Promise<AccountResponse> {
        const query = `
            INSERT INTO accounts (user_id, balance, currency, status, created_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING *
        `;
        const values = [createAccountDto.user_id, createAccountDto.balance, createAccountDto.currency, 'active'];
        const result = await this.db.query<QueryResult<AccountResponse>>(query, values);
        return result.rows[0];
    }

    public async remove(id: number, user_id: number): Promise<void> {
        const query = `
            DELETE FROM accounts 
            WHERE id = $1 AND user_id = $2
        `;
        await this.db.query(query, [id, user_id]);
    }

    public async findOne(id: number): Promise<AccountResponse> {
        const query = `
            SELECT * FROM accounts 
            WHERE id = $1
        `;
        const result = await this.db.query<QueryResult<AccountResponse>>(query, [id]);
        if (result.rows.length === 0) {
            throw new Error('Account not found');
        }
        return result.rows[0];
    }

    public async findByUserId(user_id: number): Promise<Array<AccountResponse>> {
        const query = `
            SELECT * FROM accounts 
            WHERE user_id = $1
        `;
        const result = await this.db.query<QueryResult<AccountResponse>>(query, [user_id]);
        return result.rows;
    }

    public async findByCardNumber(cardNumber: string): Promise<AccountResponse> {
        const query = `
            SELECT * FROM accounts 
            WHERE card_number = $1
        `;
        const result = await this.db.query<QueryResult<AccountResponse>>(query, [cardNumber]);
        if (result.rows.length === 0) {
            throw new Error('Account not found');
        }
        return result.rows[0];
    }

    public async updateBalance(id: number, amount: number, user_id: number): Promise<AccountResponse> {
        const query = `
            UPDATE accounts 
            SET balance = balance + $1,
                updated_at = NOW()
            WHERE id = $2 AND user_id = $3
            RETURNING *
        `;
        const result = await this.db.query<QueryResult<AccountResponse>>(query, [amount, id, user_id]);
        if (result.rows.length === 0) {
            throw new Error('Account not found');
        }
        return result.rows[0];
    }

    public async updateStatus(id: number, status: 'active' | 'inactive' | 'blocked', user_id: number): Promise<AccountResponse> {
        const query = `
            UPDATE accounts 
            SET status = $1,
                updated_at = NOW()
            WHERE id = $2 AND user_id = $3
            RETURNING *
        `;
        const result = await this.db.query<QueryResult<AccountResponse>>(query, [status, id, user_id]);
        if (result.rows.length === 0) {
            throw new Error('Account not found');
        }
        return result.rows[0];
    }

    public async findAll(): Promise<Array<AccountResponse>> {
        const query = `
            SELECT * FROM accounts
        `;
        const result = await this.db.query<QueryResult<AccountResponse>>(query);
        return result.rows;
    }

    public async deposit(id: number, amount: number, user_id: number): Promise<AccountResponse> {
        return this.updateBalance(id, amount, user_id);
    }

    public async withdraw(id: number, amount: number, user_id: number): Promise<AccountResponse> {
        return this.updateBalance(id, -amount, user_id);
    }

    public async getBalance(id: number, currency?: string): Promise<{ balance: number; currency: string; }> {
        const query = `
            SELECT balance, currency FROM accounts 
            WHERE id = $1
        `;
        const result = await this.db.query<QueryResult<{ balance: number; currency: string; }>>(query, [id]);
        if (result.rows.length === 0) {
            throw new Error('Account not found');
        }
        return result.rows[0];
    }

    public async findByIban(iban: string): Promise<AccountResponse> {
        const query = `
            SELECT * FROM accounts 
            WHERE iban = $1
        `;
        const result = await this.db.query<QueryResult<AccountResponse>>(query, [iban]);
        if (result.rows.length === 0) {
            throw new Error('Account not found');
        }
        return result.rows[0];
    }
} 