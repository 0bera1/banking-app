"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRepositoryImpl = void 0;
class AccountRepositoryImpl {
    constructor(db) {
        this.db = db;
    }
    async create(createAccountDto) {
        const query = `
            INSERT INTO accounts (user_id, balance, currency, status, created_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING *
        `;
        const values = [createAccountDto.user_id, createAccountDto.balance, createAccountDto.currency, 'active'];
        const result = await this.db.query(query, values);
        return result.rows[0];
    }
    async remove(id, user_id) {
        const query = `
            DELETE FROM accounts 
            WHERE id = $1 AND user_id = $2
        `;
        await this.db.query(query, [id, user_id]);
    }
    async findOne(id) {
        const query = `
            SELECT * FROM accounts 
            WHERE id = $1
        `;
        const result = await this.db.query(query, [id]);
        if (result.rows.length === 0) {
            throw new Error('Account not found');
        }
        return result.rows[0];
    }
    async findByUserId(user_id) {
        const query = `
            SELECT * FROM accounts 
            WHERE user_id = $1
        `;
        const result = await this.db.query(query, [user_id]);
        return result.rows;
    }
    async findByCardNumber(cardNumber) {
        const query = `
            SELECT * FROM accounts 
            WHERE card_number = $1
        `;
        const result = await this.db.query(query, [cardNumber]);
        if (result.rows.length === 0) {
            throw new Error('Account not found');
        }
        return result.rows[0];
    }
    async updateBalance(id, amount, user_id) {
        const query = `
            UPDATE accounts 
            SET balance = balance + $1,
                updated_at = NOW()
            WHERE id = $2 AND user_id = $3
            RETURNING *
        `;
        const result = await this.db.query(query, [amount, id, user_id]);
        if (result.rows.length === 0) {
            throw new Error('Account not found');
        }
        return result.rows[0];
    }
    async updateStatus(id, status, user_id) {
        const query = `
            UPDATE accounts 
            SET status = $1,
                updated_at = NOW()
            WHERE id = $2 AND user_id = $3
            RETURNING *
        `;
        const result = await this.db.query(query, [status, id, user_id]);
        if (result.rows.length === 0) {
            throw new Error('Account not found');
        }
        return result.rows[0];
    }
    async findAll() {
        const query = `
            SELECT * FROM accounts
        `;
        const result = await this.db.query(query);
        return result.rows;
    }
    async deposit(id, amount, user_id) {
        return this.updateBalance(id, amount, user_id);
    }
    async withdraw(id, amount, user_id) {
        return this.updateBalance(id, -amount, user_id);
    }
    async getBalance(id, currency) {
        const query = `
            SELECT balance, currency FROM accounts 
            WHERE id = $1
        `;
        const result = await this.db.query(query, [id]);
        if (result.rows.length === 0) {
            throw new Error('Account not found');
        }
        return result.rows[0];
    }
    async findByIban(iban) {
        const query = `
            SELECT * FROM accounts 
            WHERE iban = $1
        `;
        const result = await this.db.query(query, [iban]);
        if (result.rows.length === 0) {
            throw new Error('Account not found');
        }
        return result.rows[0];
    }
}
exports.AccountRepositoryImpl = AccountRepositoryImpl;
//# sourceMappingURL=AccountRepositoryImpl.js.map