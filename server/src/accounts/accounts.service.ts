import { NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Account } from './interface/account.interface';
import { CreateAccountDto } from './dto/create-account.dto';
import { UsersService } from '../users/users.service';
import { IUsersService } from '../users/interface/IUsersService';
import { ExchangeService, IExchangeService } from '../exchange/exchange.service';
import {UserResponseDto} from "../users/dto/user-response.dto";

export interface IAccountsService {
    create(createAccountDto: CreateAccountDto & { user_id: number }): Promise<Account>;
    remove(id: number, user_id: number): Promise<void>;
    findOne(id: number): Promise<Account>;
    findByUserId(user_id: number): Promise<Account[]>;
    findByCardNumber(cardNumber: string): Promise<Account>;
    updateBalance(id: number, amount: number, user_id: number): Promise<Account>;
    updateStatus(id: number, status: 'active' | 'inactive' | 'blocked', user_id: number): Promise<Account>;
    findAll(): Promise<Account[]>;
    deposit(id: number, amount: number, user_id: number): Promise<Account>;
    withdraw(id: number, amount: number, user_id: number): Promise<Account>;
    getBalance(id: number, currency?: string): Promise<{ balance: number; currency: string; }>;
    findByIban(iban: string): Promise<Account>;
}

export class AccountsService implements IAccountsService {
    private readonly databaseService: DatabaseService;
    private readonly usersService: IUsersService;
    private readonly exchangeService: IExchangeService;

    public constructor(
        databaseService: DatabaseService,
        usersService: IUsersService,
        exchangeService: IExchangeService
    ) {
        this.databaseService = databaseService;
        this.usersService = usersService;
        this.exchangeService = exchangeService;
    }

    private generateIban(): string {
        // TR + 24 haneli rastgele sayı
        const randomNumber:string = Math.floor(Math.random() * 1000000000000000000000000).toString().padStart(24, '0');
        return `TR${randomNumber}`;
    }

    private async isIbanUnique(iban: string): Promise<boolean> {
        const query = 'SELECT COUNT(*) FROM accounts WHERE iban = $1';
        const result = await this.databaseService.query(query, [iban]);
        return result.rows[0].count === '0';
    }

    private async generateUniqueIban(): Promise<string> {
        let iban: string;
        let isUnique:boolean = false;

        while (!isUnique) {
            iban = this.generateIban();
            isUnique = await this.isIbanUnique(iban);
        }

        return iban;
    }

    private generateCardNumber(): string {
        // VISA: 4 ile başlar, 16 haneli
        // Mastercard: 5 ile başlar, 16 haneli
        // AMEX: 3 ile başlar, 15 haneli
        const prefix = Math.random() > 0.5 ? '4' : '5'; // VISA veya Mastercard
        let cardNumber = prefix;
        
        // 15 haneli rastgele sayı oluştur (prefix hariç)
        for (let i = 0; i < 14; i++) {
            cardNumber += Math.floor(Math.random() * 10);
        }

        // Luhn algoritması ile kontrol hanesi ekle
        let sum : number = 0;
        let isEven:boolean = false;
        for (let i:number = cardNumber.length - 1; i >= 0; i--) {
            let digit :number = parseInt(cardNumber[i]);
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
            isEven = !isEven;
        }
        const checkDigit : number = (10 - (sum % 10)) % 10;
        return cardNumber + checkDigit;
    }

    // Yeni hesap oluşturma
    async create(createAccountDto: CreateAccountDto & { user_id: number }): Promise<Account> {
        try {
            console.log('Creating account with data:', createAccountDto);
            
            if (!createAccountDto.user_id) {
                console.error('User ID is missing');
                throw new BadRequestException('Kullanıcı ID\'si bulunamadı');
            }

            // Kullanıcıyı kontrol et
            const user :UserResponseDto = await this.usersService.findOne(createAccountDto.user_id);
            if (!user) {
                console.error('User not found:', createAccountDto.user_id);
                throw new NotFoundException('Kullanıcı bulunamadı');
            }

            // Benzersiz IBAN oluştur
            const iban :string = await this.generateUniqueIban();
            console.log('Generated IBAN:', iban);

            const query = `
                INSERT INTO accounts 
                (card_number, card_holder_name, card_brand, card_issuer, card_type, balance, user_id, currency, iban)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *
            `;
            
            const values :(string|number)[] = [
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

            // Query'i çalıştır
            const result = await this.databaseService.query(query, values);
            console.log('Query result:', result);
            
            if (!result.rows || result.rows.length === 0) {
                console.error('No rows returned from query');
                throw new Error('Hesap oluşturulamadı');
            }
            
            return result.rows[0];
        } catch (error) {
            console.error('Error in create:', error);
            if (error.code === '23505') { // Unique constraint violation
                throw new BadRequestException('Bu kart numarası zaten kullanımda');
            }
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
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
        } catch (error) {
            console.error('Error in findByUserId:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            throw new Error(`Hesaplar getirilirken bir hata oluştu: ${error.message}`);
        }
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
        const account:Account = await this.findOne(id);
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
        const account:Account = await this.findOne(id);
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

    async deposit(id: number, amount: number, user_id: number) {
        if (amount <= 0) {
            throw new BadRequestException('Yatırılacak tutar pozitif olmalıdır');
        }

        // Hesabın kullanıcıya ait olduğunu kontrol et
        const account:Account = await this.findOne(id);
        if (!account) {
            throw new NotFoundException('Hesap bulunamadı');
        }

        if (account.user_id !== user_id) {
            throw new BadRequestException('Bu hesap üzerinde işlem yapmaya yetkiniz yok');
        }

        if (account.status !== 'active') {
            throw new BadRequestException('Bu hesap aktif değil');
        }

        const query = `
            UPDATE accounts 
            SET balance = balance + $1 
            WHERE id = $2 AND user_id = $3
            RETURNING *
        `;

        const result = await this.databaseService.query(query, [amount, id, user_id]);

        if (result.rows.length === 0) {
            throw new NotFoundException('Hesap bulunamadı');
        }

        return result.rows[0];
    }

    async withdraw(id: number, amount: number, user_id: number) {
        if (amount <= 0) {
            throw new BadRequestException('Çekilecek tutar pozitif olmalıdır');
        }

        // Hesabın kullanıcıya ait olduğunu kontrol et
        const account:Account = await this.findOne(id);
        if (!account) {
            throw new NotFoundException('Hesap bulunamadı');
        }

        if (account.user_id !== user_id) {
            throw new BadRequestException('Bu hesap üzerinde işlem yapmaya yetkiniz yok');
        }

        if (account.status !== 'active') {
            throw new BadRequestException('Bu hesap aktif değil');
        }

        if (account.balance < amount) {
            throw new BadRequestException('Yetersiz bakiye');
        }

        const query = `
            UPDATE accounts 
            SET balance = balance - $1 
            WHERE id = $2 AND user_id = $3
            RETURNING *
        `;

        const result = await this.databaseService.query(query, [amount, id, user_id]);

        if (result.rows.length === 0) {
            throw new NotFoundException('Hesap bulunamadı');
        }

        return result.rows[0];
    }

    async getBalance(id: number, currency?: string) {
        const account:Account = await this.findOne(id);
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

    async findByIban(iban: string): Promise<Account> {
        const query = 'SELECT * FROM accounts WHERE iban = $1';
        const result = await this.databaseService.query(query, [iban]);
        return result.rows[0];
    }
}
