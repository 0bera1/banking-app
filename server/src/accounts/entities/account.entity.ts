import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Kart markaları için enum
export enum CardBrand {
    VISA = 'visa',
    MASTERCARD = 'mastercard',
    AMEX = 'amex'
}

// Kart veren kuruluşlar için enum
export enum CardIssuer {
    BANK_A = 'bank_a',
    BANK_B = 'bank_b',
    BANK_C = 'bank_c'
}

// Kart tipleri için enum
export enum CardType {
    CREDIT = 'credit',
    DEBIT = 'debit'
}

// Para birimleri için enum
export enum Currency {
    TRY = 'TRY',
    USD = 'USD',
    EUR = 'EUR'
}

// Hesap durumu için enum
export enum AccountStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    BLOCKED = 'blocked'
}

@Entity('accounts')
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 16 })
    card_number: string; // 16 haneli kart numarası

    @Column()
    card_holder_name: string;

    @Column({
        type: 'enum',
        enum: CardBrand
    })
    card_brand: CardBrand;

    @Column({
        type: 'enum',
        enum: CardIssuer
    })
    card_issuer: CardIssuer;

    @Column({
        type: 'enum',
        enum: CardType
    })
    card_type: CardType;

    @Column('decimal', { precision: 10, scale: 2 })
    balance: number; // Decimal/float değer

    @Column({
        type: 'enum',
        enum: Currency,
        default: Currency.TRY
    })
    currency: Currency;

    @Column({
        type: 'enum',
        enum: AccountStatus,
        default: AccountStatus.ACTIVE
    })
    status: AccountStatus;

    @Column()
    user_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ length: 26 })
    iban: string; // TR ile başlayan 26 karakterlik IBAN
} 