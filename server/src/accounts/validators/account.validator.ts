import { AccountValidationContract } from '../interfaces/account.interface';
import { AccountRepository } from '../repositories/account.repository';

export class AccountValidator implements AccountValidationContract {
    constructor(private readonly repository: AccountRepository) {}

    public async validateTransfer(fromAccountId: number, toAccountId: number, amount: number): Promise<void> {
        if (amount <= 0) {
            throw new Error('Transfer tutarı sıfırdan büyük olmalıdır');
        }

        const fromAccount = await this.repository.findOne(fromAccountId);
        if (!fromAccount) {
            throw new Error('Gönderen hesap bulunamadı');
        }

        const toAccount = await this.repository.findOne(toAccountId);
        if (!toAccount) {
            throw new Error('Alıcı hesap bulunamadı');
        }

        if (fromAccount.balance < amount) {
            throw new Error('Yetersiz bakiye');
        }

        if (fromAccount.status !== 'active') {
            throw new Error('Gönderen hesap aktif değil');
        }

        if (toAccount.status !== 'active') {
            throw new Error('Alıcı hesap aktif değil');
        }
    }

    public async validateAccountCreation(userId: number, initialBalance: number): Promise<void> {
        if (!userId) {
            throw new Error('Kullanıcı ID gereklidir');
        }

        if (initialBalance < 0) {
            throw new Error('Başlangıç bakiyesi sıfırdan küçük olamaz');
        }
    }

    public async validateAccountClosure(accountId: number): Promise<void> {
        const account = await this.repository.findOne(accountId);
        if (!account) {
            throw new Error('Hesap bulunamadı');
        }

        if (account.balance > 0) {
            throw new Error('Hesap kapatılmadan önce bakiye sıfırlanmalıdır');
        }
    }

    public async validateBalanceUpdate(id: number, amount: number): Promise<void> {
        const account = await this.repository.findOne(id);
        if (!account) {
            throw new Error('Hesap bulunamadı');
        }

        if (account.status !== 'active') {
            throw new Error('Hesap aktif değil');
        }

        if (amount === 0) {
            throw new Error('İşlem tutarı sıfır olamaz');
        }
    }

    public async validateStatusUpdate(id: number, status: 'active' | 'inactive' | 'blocked'): Promise<void> {
        const account = await this.repository.findOne(id);
        if (!account) {
            throw new Error('Hesap bulunamadı');
        }

        if (account.status === status) {
            throw new Error('Hesap zaten bu durumda');
        }
    }

    public async validateDeposit(id: number, amount: number): Promise<void> {
        if (amount <= 0) {
            throw new Error('Para yatırma tutarı sıfırdan büyük olmalıdır');
        }

        const account = await this.repository.findOne(id);
        if (!account) {
            throw new Error('Hesap bulunamadı');
        }

        if (account.status !== 'active') {
            throw new Error('Hesap aktif değil');
        }
    }

    public async validateWithdraw(id: number, amount: number): Promise<void> {
        if (amount <= 0) {
            throw new Error('Para çekme tutarı sıfırdan büyük olmalıdır');
        }

        const account = await this.repository.findOne(id);
        if (!account) {
            throw new Error('Hesap bulunamadı');
        }

        if (account.status !== 'active') {
            throw new Error('Hesap aktif değil');
        }

        if (account.balance < amount) {
            throw new Error('Yetersiz bakiye');
        }
    }
} 