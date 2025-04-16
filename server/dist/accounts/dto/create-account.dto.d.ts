import { CardBrand, CardIssuer, CardType, Currency } from '../entities/account.entity';
export declare class CreateAccountDto {
    cardNumber: string;
    cardHolderName: string;
    cardBrand: CardBrand;
    cardIssuer: CardIssuer;
    cardType: CardType;
    initialBalance?: number;
    currency?: Currency;
    user_id: number;
}
