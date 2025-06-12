export interface CreateAccountDto {
    account_number: string;
    balance: number;
    currency: string;
    status: 'active' | 'inactive' | 'blocked';
    iban: string;
}
