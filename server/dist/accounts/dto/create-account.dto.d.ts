export interface CreateAccountDto {
    user_id: number;
    account_number: string;
    balance?: number;
    currency?: string;
    status?: string;
    cardHolderName?: string;
    cardBrand?: string;
    cardIssuer?: string;
    cardType?: string;
    initialBalance?: number;
}
