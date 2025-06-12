"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRepository = void 0;
class AccountRepository {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    mapToAccountResponse(row) {
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
    async getBalance(id, currency) {
        const result = await this.databaseService.query('SELECT balance, currency FROM accounts WHERE id = $1', [id]);
        return {
            balance: result.rows[0].balance,
            currency: result.rows[0].currency
        };
    }
    async updateBalance(id, amount, user_id) {
        const result = await this.databaseService.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3 RETURNING *', [amount, id, user_id]);
        return this.mapToAccountResponse(result.rows[0]);
    }
    async create(createAccountDto) {
        const result = await this.databaseService.query(`INSERT INTO accounts (user_id, balance, currency, status, iban)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`, [createAccountDto.user_id, createAccountDto.balance, createAccountDto.currency, 'active', createAccountDto.iban]);
        return this.mapToAccountResponse(result.rows[0]);
    }
    async remove(id, userId) {
        await this.databaseService.query('DELETE FROM accounts WHERE id = $1 AND user_id = $2', [id, userId]);
    }
    async findOne(id) {
        const result = await this.databaseService.query('SELECT * FROM accounts WHERE id = $1', [id]);
        return this.mapToAccountResponse(result.rows[0]);
    }
    async findByUserId(userId) {
        const result = await this.databaseService.query('SELECT * FROM accounts WHERE user_id = $1', [userId]);
        return result.rows.map(row => this.mapToAccountResponse(row));
    }
    async findByCardNumber(cardNumber) {
        const result = await this.databaseService.query('SELECT * FROM accounts WHERE account_number = $1', [cardNumber]);
        return this.mapToAccountResponse(result.rows[0]);
    }
    async updateStatus(id, status, userId) {
        const result = await this.databaseService.query('UPDATE accounts SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *', [status, id, userId]);
        return this.mapToAccountResponse(result.rows[0]);
    }
    async findAll() {
        if (!this.databaseService) {
            throw new Error('Veritabanı servisi başlatılmadı');
        }
        const query = `
            SELECT * FROM accounts ORDER BY created_at DESC
        `;
        const result = await this.databaseService.query(query);
        return result.rows.map(row => this.mapToAccountResponse(row));
    }
    async deposit(id, amount, userId) {
        const result = await this.databaseService.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3 RETURNING *', [amount, id, userId]);
        return this.mapToAccountResponse(result.rows[0]);
    }
    async withdraw(id, amount, userId) {
        const result = await this.databaseService.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3 RETURNING *', [amount, id, userId]);
        return this.mapToAccountResponse(result.rows[0]);
    }
    async findByIban(iban) {
        const query = `
            SELECT * FROM accounts WHERE iban = $1
        `;
        const result = await this.databaseService.query(query, [iban]);
        return this.mapToAccountResponse(result.rows[0]);
    }
    generateIban() {
        const countryCode = 'TR';
        const bankCode = '00';
        const randomNumber = Math.floor(Math.random() * 1000000000000000).toString().padStart(14, '0');
        return `${countryCode}${bankCode}${randomNumber}`;
    }
}
exports.AccountRepository = AccountRepository;
//# sourceMappingURL=account.repository.js.map