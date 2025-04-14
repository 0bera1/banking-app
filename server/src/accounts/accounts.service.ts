import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
    constructor(private readonly databaseService: DatabaseService) {}

    // Yeni hesap oluşturma
    async create(createAccountDto: CreateAccountDto): Promise<Account> {
        const { card_number, card_holder_name, card_brand, card_issuer, card_type, initial_balance } = createAccountDto;
        
        const query = `
            INSERT INTO accounts 
            (card_number, card_holder_name, card_brand, card_issuer, card_type, balance)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        
        const values = [
            card_number,
            card_holder_name,
            card_brand,
            card_issuer,
            card_type,
            initial_balance || 0
        ];

        const result = await this.databaseService.query(query, values);
        return result.rows[0];
    }

    // Hesap silme
    async remove(id: number): Promise<void> {
        const query = 'DELETE FROM accounts WHERE id = $1';
        await this.databaseService.query(query, [id]);
    }

    // Hesap detayı görüntüleme
    async findOne(id: number): Promise<Account> {
        const query = 'SELECT * FROM accounts WHERE id = $1';
        const result = await this.databaseService.query(query, [id]);
        return result.rows[0];
    }

    // Kart numarasına göre hesap bulma
    async findByCardNumber(cardNumber: string): Promise<Account> {
        const query = 'SELECT * FROM accounts WHERE card_number = $1';
        const result = await this.databaseService.query(query, [cardNumber]);
        return result.rows[0];
    }

    // Bakiye güncelleme
    async updateBalance(id: number, amount: number): Promise<Account> {
        const query = `
            UPDATE accounts 
            SET balance = balance + $2
            WHERE id = $1
            RETURNING *
        `;
        const result = await this.databaseService.query(query, [id, amount]);
        return result.rows[0];
    }

    // Hesap durumunu güncelleme
    async updateStatus(id: number, status: 'active' | 'inactive' | 'blocked'): Promise<Account> {
        const query = `
            UPDATE accounts 
            SET status = $2
            WHERE id = $1
            RETURNING *
        `;
        const result = await this.databaseService.query(query, [id, status]);
        return result.rows[0];
    }
}
