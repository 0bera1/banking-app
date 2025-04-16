export declare enum CardBrand {
    VISA = "visa",
    MASTERCARD = "mastercard",
    AMEX = "amex"
}
export declare enum CardIssuer {
    BANK_A = "bank_a",
    BANK_B = "bank_b",
    BANK_C = "bank_c"
}
export declare enum CardType {
    CREDIT = "credit",
    DEBIT = "debit"
}
export declare enum Currency {
    TRY = "TRY",
    USD = "USD",
    EUR = "EUR"
}
export declare enum AccountStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    BLOCKED = "blocked"
}
export declare class Account {
    id: number;
    card_number: string;
    card_holder_name: string;
    card_brand: CardBrand;
    card_issuer: CardIssuer;
    card_type: CardType;
    balance: number;
    currency: Currency;
    status: AccountStatus;
    user_id: number;
    created_at: Date;
    updated_at: Date;
    iban: string;
}
