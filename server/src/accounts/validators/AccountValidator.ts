import { AccountValidationContract } from '../interfaces/account.interface';
import { AccountRepository } from '../repositories/account.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Logger } from '@nestjs/common';

export class AccountValidator implements AccountValidationContract {
    private readonly repository: AccountRepository;
    private readonly logger = new Logger(AccountValidator.name);
    private readonly MAX_INITIAL_BALANCE = 1000000;
    private readonly MAX_ACCOUNTS_PER_USER = 5;
    private readonly MIN_TRANSACTION_AMOUNT = 1;
    private readonly MAX_TRANSACTION_AMOUNT = 50000;

    constructor(repository: AccountRepository) {
        this.repository = repository;
    }

    public async validateAccountCreation(userId: number, initialBalance: number): Promise<void> {
        this.logger.log(`${userId} numaralı kullanıcı için hesap oluşturma doğrulaması yapılıyor`);
        
        if (!userId) {
            throw new Error('Kullanıcı ID gereklidir');
        }

        if (initialBalance < 0) {
            throw new Error('Başlangıç bakiyesi sıfırdan küçük olamaz');
        }

        if (initialBalance > this.MAX_INITIAL_BALANCE) {
            throw new BadRequestException(`Maksimum başlangıç bakiyesi (${this.MAX_INITIAL_BALANCE}) aşıldı`);
        }

        const userAccounts = await this.repository.findByUserId(userId);
        if (userAccounts.length >= this.MAX_ACCOUNTS_PER_USER) {
            throw new BadRequestException(`Maksimum hesap sayısına (${this.MAX_ACCOUNTS_PER_USER}) ulaşıldı`);
        }
    }

    public async validateAccountClosure(accountId: number): Promise<void> {
        this.logger.log(`${accountId} numaralı hesap için kapatma doğrulaması yapılıyor`);
        
        const account = await this.repository.findOne(accountId);
        if (!account) {
            throw new NotFoundException('Hesap bulunamadı');
        }

        if (account.balance > 0) {
            throw new BadRequestException('Hesap kapatılmadan önce bakiye sıfırlanmalıdır');
        }
    }

    public async validateBalanceUpdate(accountId: number, amount: number): Promise<void> {
        this.logger.log(`${accountId} numaralı hesap için bakiye güncelleme doğrulaması yapılıyor`);
        
        const account = await this.repository.findOne(accountId);
        if (!account) {
            throw new NotFoundException('Hesap bulunamadı');
        }

        if (account.status !== 'active') {
            throw new BadRequestException('Hesap aktif değil');
        }

        if (amount === 0) {
            throw new BadRequestException('İşlem tutarı sıfır olamaz');
        }

        if (account.balance + amount < 0) {
            throw new BadRequestException('Yetersiz bakiye');
        }

        if (Math.abs(amount) < this.MIN_TRANSACTION_AMOUNT) {
            throw new BadRequestException(`Minimum işlem tutarı ${this.MIN_TRANSACTION_AMOUNT} olmalıdır`);
        }

        if (Math.abs(amount) > this.MAX_TRANSACTION_AMOUNT) {
            throw new BadRequestException(`Maksimum işlem tutarı ${this.MAX_TRANSACTION_AMOUNT} olmalıdır`);
        }
    }

    public async validateStatusUpdate(accountId: number, status: 'active' | 'inactive' | 'blocked'): Promise<void> {
        this.logger.log(`${accountId} numaralı hesap için durum güncelleme doğrulaması yapılıyor`);
        
        const account = await this.repository.findOne(accountId);
        if (!account) {
            throw new NotFoundException('Hesap bulunamadı');
        }

        if (account.status === status) {
            throw new BadRequestException('Hesap zaten bu durumda');
        }

        if (!['active', 'inactive', 'blocked'].includes(status)) {
            throw new BadRequestException('Geçersiz hesap durumu');
        }

        if (status === 'blocked' && account.balance > 0) {
            throw new BadRequestException('Pozitif bakiyeli hesap bloke edilemez');
        }
    }

    public async validateDeposit(accountId: number, amount: number): Promise<void> {
        this.logger.log(`${accountId} numaralı hesap için para yatırma doğrulaması yapılıyor`);
        
        if (amount <= 0) {
            throw new BadRequestException('Para yatırma tutarı sıfırdan büyük olmalıdır');
        }

        if (amount > this.MAX_TRANSACTION_AMOUNT) {
            throw new BadRequestException(`Maksimum para yatırma tutarı ${this.MAX_TRANSACTION_AMOUNT} olmalıdır`);
        }

        await this.validateBalanceUpdate(accountId, amount);
    }

    public async validateWithdraw(accountId: number, amount: number): Promise<void> {
        this.logger.log(`${accountId} numaralı hesap için para çekme doğrulaması yapılıyor`);
        
        if (amount <= 0) {
            throw new BadRequestException('Para çekme tutarı sıfırdan büyük olmalıdır');
        }

        if (amount > this.MAX_TRANSACTION_AMOUNT) {
            throw new BadRequestException(`Maksimum para çekme tutarı ${this.MAX_TRANSACTION_AMOUNT} olmalıdır`);
        }

        await this.validateBalanceUpdate(accountId, -amount);
    }

    public async validateTransfer(fromAccountId: number, toAccountId: number, amount: number): Promise<void> {
        this.logger.log(`${fromAccountId} numaralı hesaptan ${toAccountId} numaralı hesaba transfer doğrulaması yapılıyor`);
        
        if (amount <= 0) {
            throw new BadRequestException('Transfer tutarı sıfırdan büyük olmalıdır');
        }

        if (amount > this.MAX_TRANSACTION_AMOUNT) {
            throw new BadRequestException(`Maksimum transfer tutarı ${this.MAX_TRANSACTION_AMOUNT} olmalıdır`);
        }

        const fromAccount = await this.repository.findOne(fromAccountId);
        const toAccount = await this.repository.findOne(toAccountId);

        if (!fromAccount || !toAccount) {
            throw new NotFoundException('Hesap bulunamadı');
        }

        if (fromAccount.status !== 'active' || toAccount.status !== 'active') {
            throw new BadRequestException('Aktif olmayan hesaplar arasında transfer yapılamaz');
        }

        if (fromAccount.balance < amount) {
            throw new BadRequestException('Yetersiz bakiye');
        }

        await this.validateWithdraw(fromAccountId, amount);
        await this.validateDeposit(toAccountId, amount);
    }
} 