-- Accounts tablosuna IBAN kolonu ekleme
ALTER TABLE accounts
ADD COLUMN IF NOT EXISTS iban VARCHAR(26) UNIQUE;

-- IBAN için indeks oluştur
CREATE INDEX IF NOT EXISTS idx_accounts_iban ON accounts(iban);

-- IBAN oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION generate_iban()
RETURNS VARCHAR(26) AS $$
DECLARE
    country_code VARCHAR(2) := 'TR';
    check_digits VARCHAR(2) := '00';
    bank_code VARCHAR(5) := '00001';  -- Banka kodu (örnek)
    account_number VARCHAR(17);
BEGIN
    -- Rastgele 17 haneli hesap numarası oluştur
    account_number := LPAD(FLOOR(RANDOM() * 99999999999999999)::TEXT, 17, '0');
    
    -- IBAN formatı: TR + 2 kontrol hanesi + 5 haneli banka kodu + 17 haneli hesap numarası
    RETURN country_code || check_digits || bank_code || account_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger fonksiyonu
CREATE OR REPLACE FUNCTION set_iban_before_insert()
RETURNS TRIGGER AS $$
DECLARE
    new_iban VARCHAR(26);
    is_unique BOOLEAN := FALSE;
BEGIN
    -- Benzersiz IBAN oluşturana kadar döngüye gir
    WHILE NOT is_unique LOOP
        new_iban := generate_iban();
        
        -- IBAN'ın benzersiz olup olmadığını kontrol et
        SELECT NOT EXISTS (
            SELECT 1 FROM accounts WHERE iban = new_iban
        ) INTO is_unique;
    END LOOP;
    
    -- Yeni IBAN'ı ata
    NEW.iban := new_iban;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger oluştur
DROP TRIGGER IF EXISTS tr_set_iban_before_insert ON accounts;
CREATE TRIGGER tr_set_iban_before_insert
    BEFORE INSERT ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION set_iban_before_insert(); 