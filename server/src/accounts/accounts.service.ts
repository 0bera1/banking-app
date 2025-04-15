import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UsersService } from '../users/users.service';
import { ExchangeService } from '../exchange/exchange.service';

@Injectable()
export class AccountsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly usersService: UsersService,
        private readonly exchangeService: ExchangeService
    ) {}

    // Yeni hesap oluşturma
    async create(createAccountDto: CreateAccountDto & { user_id: number }): Promise<Account> {
        try {
            console.log('Creating account with data:', createAccountDto);
            
            // Kullanıcıyı kontrol et
            const user = await this.usersService.findOne(createAccountDto.user_id);
            if (!user) {
                throw new NotFoundException('Kullanıcı bulunamadı');
            }

            const query = `
                INSERT INTO accounts 
                (card_number, card_holder_name, card_brand, card_issuer, card_type, balance, user_id, currency)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
            `;
            
            const values = [
                createAccountDto.cardNumber,
                createAccountDto.cardHolderName,
                createAccountDto.cardBrand,
                createAccountDto.cardIssuer,
                createAccountDto.cardType,
                createAccountDto.initialBalance || 0,
                createAccountDto.user_id,
                createAccountDto.currency || 'TRY'
            ];

            console.log('Executing query:', query);
            console.log('With values:', values);

            const result = await this.databaseService.query(query, values);
            console.log('Query result:', result);
            return result.rows[0];
        } catch (error) {
            console.error('Error in create:', error);
            throw error;
        }
    }

    // Hesap silme
    async remove(id: number, user_id: number): Promise<void> {
        // Önce hesabın kullanıcıya ait olduğunu kontrol et
        const account = await this.findOne(id);
        if (!account) {
            throw new NotFoundException('Hesap bulunamadı');
        }
        
        if (account.user_id !== user_id) {
            throw new BadRequestException('Bu hesap üzerinde işlem yapmaya yetkiniz yok');
        }

        const query = 'DELETE FROM accounts WHERE id = $1 AND user_id = $2';
        await this.databaseService.query(query, [id, user_id]);
    }

    // Hesap detayı görüntüleme
    async findOne(id: number): Promise<Account> {
        const query = 'SELECT * FROM accounts WHERE id = $1';
        const result = await this.databaseService.query(query, [id]);
        return result.rows[0];
    }

    // Kullanıcının hesaplarını listeleme
    async findByUserId(user_id: number): Promise<Account[]> {
        const query = 'SELECT * FROM accounts WHERE user_id = $1';
        const result = await this.databaseService.query(query, [user_id]);
        return result.rows;
    }

    // Kart numarasına göre hesap bulma
    async findByCardNumber(cardNumber: string): Promise<Account> {
        const query = 'SELECT * FROM accounts WHERE card_number = $1';
        const result = await this.databaseService.query(query, [cardNumber]);
        return result.rows[0];
    }

    // Bakiye güncelleme
    async updateBalance(id: number, amount: number, user_id: number): Promise<Account> {
        // Önce hesabın kullanıcıya ait olduğunu kontrol et
        const account = await this.findOne(id);
        if (!account) {
            throw new NotFoundException('Hesap bulunamadı');
        }
        
        if (account.user_id !== user_id) {
            throw new BadRequestException('Bu hesap üzerinde işlem yapmaya yetkiniz yok');
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

    // Hesap durumu güncelleme
    async updateStatus(id: number, status: 'active' | 'inactive' | 'blocked', user_id: number): Promise<Account> {
        // Önce hesabın kullanıcıya ait olduğunu kontrol et
        const account = await this.findOne(id);
        if (!account) {
            throw new NotFoundException('Hesap bulunamadı');
        }
        
        if (account.user_id !== user_id) {
            throw new BadRequestException('Bu hesap üzerinde işlem yapmaya yetkiniz yok');
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

    async deposit(id: number, amount: number) {
        if (amount <= 0) {
            throw new BadRequestException('Amount must be positive');
        }

        const query = `
            UPDATE accounts 
            SET balance = balance + $1 
            WHERE id = $2 
            RETURNING *
        `;

        const result = await this.databaseService.query(query, [amount, id]);

        if (result.rows.length === 0) {
            throw new NotFoundException('Account not found');
        }

        return result.rows[0];
    }

    async withdraw(id: number, amount: number) {
        if (amount <= 0) {
            throw new BadRequestException('Amount must be positive');
        }

        const client = await this.databaseService.getClient();
        try {
            await client.query('BEGIN');

            // Önce hesabı kontrol et
            const checkQuery = 'SELECT * FROM accounts WHERE id = $1 FOR UPDATE';
            const checkResult = await client.query(checkQuery, [id]);

            if (checkResult.rows.length === 0) {
                throw new NotFoundException('Account not found');
            }

            const account = checkResult.rows[0];
            if (account.balance < amount) {
                throw new BadRequestException('Insufficient balance');
            }

            // Para çek
            const updateQuery = `
                UPDATE accounts 
                SET balance = balance - $1 
                WHERE id = $2 
                RETURNING *
            `;
            const result = await client.query(updateQuery, [amount, id]);

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getBalance(id: number, currency?: string) {
        const account = await this.findOne(id);
        if (!account) {
            throw new Error('Hesap bulunamadı');
        }

        if (!currency || currency === account.currency) {
            return { balance: account.balance, currency: account.currency };
        }

        const convertedBalance = await this.exchangeService.convertAmount(
            account.balance,
            account.currency,
            currency,
        );

        return { balance: convertedBalance, currency };
    }
}
