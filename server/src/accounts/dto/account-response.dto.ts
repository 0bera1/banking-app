export interface AccountResponse {
    id: number;
    userId: number;
    accountNumber: string;
    balance: number;
    currency: string;
    status: 'active' | 'inactive' | 'blocked';
    iban: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface BalanceResponse {
    balance: number;
    currency: string;
}

export interface IbanVerificationResponse {
    isValid: boolean;
    message: string;
}

export interface AccountStatusResponse {
    status: 'active' | 'inactive' | 'blocked';
    message: string;
} 