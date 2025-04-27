"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsService = void 0;
const common_1 = require("@nestjs/common");
class AccountsService {
    constructor(databaseService, usersService, exchangeService) {
        this.databaseService = databaseService;
        this.usersService = usersService;
        this.exchangeService = exchangeService;
    }
    generateIban() {
        const randomNumber = Math.floor(Math.random() * 1000000000000000000000000).toString().padStart(24, '0');
        return `TR${randomNumber}`;
    }
    async isIbanUnique(iban) {
        const query = 'SELECT COUNT(*) FROM accounts WHERE iban = $1';
        const result = await this.databaseService.query(query, [iban]);
        return result.rows[0].count === '0';
    }
    async generateUniqueIban() {
        let iban;
        let isUnique = false;
        while (!isUnique) {
            iban = this.generateIban();
            isUnique = await this.isIbanUnique(iban);
        }
        return iban;
    }
    generateCardNumber() {
        const prefix = Math.random() > 0.5 ? '4' : '5';
        let cardNumber = prefix;
        for (let i = 0; i < 14; i++) {
            cardNumber += Math.floor(Math.random() * 10);
        }
        let sum = 0;
        let isEven = false;
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber[i]);
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
            isEven = !isEven;
        }
        const checkDigit = (10 - (sum % 10)) % 10;
        return cardNumber + checkDigit;
    }
    async create(createAccountDto) {
        try {
            console.log('Creating account with data:', createAccountDto);
            if (!createAccountDto.user_id) {
                console.error('User ID is missing');
                throw new common_1.BadRequestException('Kullanıcı ID\'si bulunamadı');
            }
            const user = await this.usersService.findOne(createAccountDto.user_id);
            if (!user) {
                console.error('User not found:', createAccountDto.user_id);
                throw new common_1.NotFoundException('Kullanıcı bulunamadı');
            }
            const iban = await this.generateUniqueIban();
            console.log('Generated IBAN:', iban);
            const query = `
                INSERT INTO accounts 
                (card_number, card_holder_name, card_brand, card_issuer, card_type, balance, user_id, currency, iban)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *
            `;
            const values = [
                this.generateCardNumber(),
                createAccountDto.cardHolderName,
                createAccountDto.cardBrand,
                createAccountDto.cardIssuer,
                createAccountDto.cardType,
                createAccountDto.initialBalance || 0,
                createAccountDto.user_id,
                createAccountDto.currency || 'TRY',
                iban
            ];
            console.log('Executing query:', query);
            console.log('With values:', values);
            const result = await this.databaseService.query(query, values);
            console.log('Query result:', result);
            if (!result.rows || result.rows.length === 0) {
                console.error('No rows returned from query');
                throw new Error('Hesap oluşturulamadı');
            }
            return result.rows[0];
        }
        catch (error) {
            console.error('Error in create:', error);
            if (error.code === '23505') {
                throw new common_1.BadRequestException('Bu kart numarası zaten kullanımda');
            }
            if (error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            console.error('Detailed error:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            throw new Error(`Hesap oluşturulurken bir hata oluştu: ${error.message}`);
        }
    }
    async remove(id, user_id) {
        const account = await this.findOne(id);
        if (!account) {
            throw new common_1.NotFoundException('Hesap bulunamadı');
        }
        if (account.user_id !== user_id) {
            throw new common_1.BadRequestException('Bu hesap üzerinde işlem yapmaya yetkiniz yok');
        }
        const query = 'DELETE FROM accounts WHERE id = $1 AND user_id = $2';
        await this.databaseService.query(query, [id, user_id]);
    }
    async findOne(id) {
        const query = 'SELECT * FROM accounts WHERE id = $1';
        const result = await this.databaseService.query(query, [id]);
        return result.rows[0];
    }
    async findByUserId(user_id) {
        try {
            console.log('Finding accounts for user:', user_id);
            const query = 'SELECT * FROM accounts WHERE user_id = $1';
            console.log('Executing query:', query);
            console.log('With params:', [user_id]);
            const result = await this.databaseService.query(query, [user_id]);
            console.log('Query result:', result);
            if (!result || !result.rows) {
                console.error('No result or rows from query');
                return [];
            }
            console.log('Found accounts:', result.rows);
            return result.rows;
        }
        catch (error) {
            console.error('Error in findByUserId:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            throw new Error(`Hesaplar getirilirken bir hata oluştu: ${error.message}`);
        }
    }
    async findByCardNumber(cardNumber) {
        const query = 'SELECT * FROM accounts WHERE card_number = $1';
        const result = await this.databaseService.query(query, [cardNumber]);
        return result.rows[0];
    }
    async updateBalance(id, amount, user_id) {
        const account = await this.findOne(id);
        if (!account) {
            throw new common_1.NotFoundException('Hesap bulunamadı');
        }
        if (account.user_id !== user_id) {
            throw new common_1.BadRequestException('Bu hesap üzerinde işlem yapmaya yetkiniz yok');
        }
        const query = `
            UPDATE accounts 
            SET balance = balance + $1
            WHERE id = $2 AND user_id = $3
            RETURNING *
        `;
        const result = await this.databaseService.query(query, [amount, id, user_id]);
        return result.rows[0];
    }
    async updateStatus(id, status, user_id) {
        const account = await this.findOne(id);
        if (!account) {
            throw new common_1.NotFoundException('Hesap bulunamadı');
        }
        if (account.user_id !== user_id) {
            throw new common_1.BadRequestException('Bu hesap üzerinde işlem yapmaya yetkiniz yok');
        }
        const query = `
            UPDATE accounts 
            SET status = $1
            WHERE id = $2 AND user_id = $3
            RETURNING *
        `;
        const result = await this.databaseService.query(query, [status, id, user_id]);
        return result.rows[0];
    }
    async findAll() {
        const query = 'SELECT * FROM accounts';
        const result = await this.databaseService.query(query);
        return result.rows;
    }
    async deposit(id, amount, user_id) {
        if (amount <= 0) {
            throw new common_1.BadRequestException('Yatırılacak tutar pozitif olmalıdır');
        }
        const account = await this.findOne(id);
        if (!account) {
            throw new common_1.NotFoundException('Hesap bulunamadı');
        }
        if (account.user_id !== user_id) {
            throw new common_1.BadRequestException('Bu hesap üzerinde işlem yapmaya yetkiniz yok');
        }
        if (account.status !== 'active') {
            throw new common_1.BadRequestException('Bu hesap aktif değil');
        }
        const query = `
            UPDATE accounts 
            SET balance = balance + $1 
            WHERE id = $2 AND user_id = $3
            RETURNING *
        `;
        const result = await this.databaseService.query(query, [amount, id, user_id]);
        if (result.rows.length === 0) {
            throw new common_1.NotFoundException('Hesap bulunamadı');
        }
        return result.rows[0];
    }
    async withdraw(id, amount, user_id) {
        if (amount <= 0) {
            throw new common_1.BadRequestException('Çekilecek tutar pozitif olmalıdır');
        }
        const account = await this.findOne(id);
        if (!account) {
            throw new common_1.NotFoundException('Hesap bulunamadı');
        }
        if (account.user_id !== user_id) {
            throw new common_1.BadRequestException('Bu hesap üzerinde işlem yapmaya yetkiniz yok');
        }
        if (account.status !== 'active') {
            throw new common_1.BadRequestException('Bu hesap aktif değil');
        }
        if (account.balance < amount) {
            throw new common_1.BadRequestException('Yetersiz bakiye');
        }
        const query = `
            UPDATE accounts 
            SET balance = balance - $1 
            WHERE id = $2 AND user_id = $3
            RETURNING *
        `;
        const result = await this.databaseService.query(query, [amount, id, user_id]);
        if (result.rows.length === 0) {
            throw new common_1.NotFoundException('Hesap bulunamadı');
        }
        return result.rows[0];
    }
    async getBalance(id, currency) {
        const account = await this.findOne(id);
        if (!account) {
            throw new Error('Hesap bulunamadı');
        }
        if (!currency || currency === account.currency) {
            return { balance: account.balance, currency: account.currency };
        }
        const convertedBalance = await this.exchangeService.convertAmount(account.balance, account.currency, currency);
        return { balance: convertedBalance, currency };
    }
    async findByIban(iban) {
        const query = 'SELECT * FROM accounts WHERE iban = $1';
        const result = await this.databaseService.query(query, [iban]);
        return result.rows[0];
    }
}
exports.AccountsService = AccountsService;
//# sourceMappingURL=accounts.service.js.map