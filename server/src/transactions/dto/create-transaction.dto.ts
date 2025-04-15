import { IsNotEmpty, IsNumber, IsUUID, Min, IsPositive, IsInt, IsString, IsOptional } from 'class-validator';

// Transaction oluşturma için DTO
export class CreateTransactionDto {
    @IsNumber()
    @IsNotEmpty()
    fromAccountId: number;

    @IsNumber()
    @IsNotEmpty()
    toAccountId: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0.01) // Minimum değer
    amount: number; // İşlem miktarı

    @IsString()
    @IsNotEmpty()
    currency: string; // Para birimi

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    description?: string; // İşlem açıklaması

    transaction_type?: string; // İşlem türü
    card_brand?: string; // Kart markası
    card_issuer?: string; // Kart yayıncısı
    card_type?: string; // Kart türü
    card_holder_name?: string; // Kart sahibi adı
    transaction_category?: string; // İşlem kategorisi
    transaction_method?: string; // Ödeme yöntemi: online, pos, etc.
    is_refund?: boolean; // İade işlemi olup olmadığı
    currency_code?: string; // Para birimi kodu
    authorization_code?: string; // Yetkilendirme kodu
    merchant_name?: string; // Ticari tesis adı
    merchant_address?: string; // Ticari tesis adresi
    email?: string; // Müşteri e-posta adresi
    phone?: string; // Müşteri telefon numarası
    device_type?: string; // Cihaz türü
    some_field?: string; // İsteğe bağlı alan

    @IsInt()
    @IsNotEmpty()
    sender_id: number;

    @IsInt()
    @IsNotEmpty()
    receiver_id: number;
} 