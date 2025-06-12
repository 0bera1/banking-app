import { Request } from 'express';

export interface AccountRequest {
    id?: number;
    userId?: number;
    amount?: number;
    currency?: string;
    status?: 'active' | 'inactive' | 'blocked';
    iban?: string;
    accountNumber?: string;
    balance?: number;
    req?: Request;
    params?: {
        id?: string;
        iban?: string;
    };
    body?: {
        amount?: number;
        status?: 'active' | 'inactive' | 'blocked';
        cardHolderName?: string;
        cardBrand?: string;
        cardIssuer?: string;
        cardType?: string;
        currency?: string;
        initialBalance?: number;
    };
    query?: {
        currency?: string;
    };
}

export interface CreateAccountRequest extends AccountRequest {
    body: {
        cardHolderName: string;
        cardBrand: string;
        cardIssuer: string;
        cardType: string;
        currency?: string;
        initialBalance?: number;
    };
}

export interface DepositRequest extends AccountRequest {
    params: {
        id: string;
    };
    body: {
        amount: number;
    };
}

export interface WithdrawRequest extends AccountRequest {
    params: {
        id: string;
    };
    body: {
        amount: number;
    };
}

export interface UpdateStatusRequest extends AccountRequest {
    params: {
        id: string;
    };
    body: {
        status: 'active' | 'inactive' | 'blocked';
    };
}

export interface VerifyIbanRequest extends AccountRequest {
    params: {
        iban: string;
    };
} 