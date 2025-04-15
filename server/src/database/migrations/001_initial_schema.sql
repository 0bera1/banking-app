-- Users tablosu
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Accounts tablosu
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    card_number VARCHAR(16) UNIQUE NOT NULL,
    card_holder_name VARCHAR(100) NOT NULL,
    card_brand VARCHAR(50),
    card_issuer VARCHAR(50),
    card_type VARCHAR(50),
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'TRY',
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions tablosu
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES accounts(id),
    receiver_id INTEGER REFERENCES accounts(id),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs tablosu
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id VARCHAR(50) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    user_id VARCHAR(50),
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User sessions tablosu
-- Kullanıcı oturumlarının kaydedildiği tablo
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- User roles tablosu
-- Kullanıcı rollerinin tanımlandığı tablo
CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Exchange rates tablosu
-- Döviz kurlarının kaydedildiği tablo
CREATE TABLE IF NOT EXISTS exchange_rates (
    id SERIAL PRIMARY KEY,
    from_currency VARCHAR(3) NOT NULL,
    to_currency VARCHAR(3) NOT NULL,
    rate DECIMAL(15,6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(from_currency, to_currency)
);

-- Transaction limits tablosu
CREATE TABLE IF NOT EXISTS transaction_limits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    daily_limit DECIMAL(15,2) NOT NULL DEFAULT 10000.00,
    weekly_limit DECIMAL(15,2) NOT NULL DEFAULT 50000.00,
    monthly_limit DECIMAL(15,2) NOT NULL DEFAULT 200000.00,
    single_transaction_limit DECIMAL(15,2) NOT NULL DEFAULT 5000.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'TRY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);
-- Bu fonksiyonun görevi:
-- Herhangi bir tabloya kayıt güncellenince updated_at alanını otomatik olarak şu anki saate ayarlamak.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    -- updated_at alanını şimdiki zaman olarak değiştir
    NEW.updated_at = CURRENT_TIMESTAMP;
    -- Güncel veriyi kaydetmek için geri döndür
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Kullanıcılar (users) tablosuna bir trigger ekliyoruz
-- Ne zaman bir kullanıcı kaydı güncellense updated_at otomatik olarak değişsin diye
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Hesaplar (accounts) tablosuna trigger ekliyoruz
-- Hesap bilgisi her güncellendiğinde updated_at otomatik olarak değişir
CREATE TRIGGER update_accounts_updated_at
    BEFORE UPDATE ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- İşlem limitleri tablosuna trigger ekliyoruz
-- Bir limit bilgisi değişirse updated_at alanı da anında güncellenir
CREATE TRIGGER update_transaction_limits_updated_at
    BEFORE UPDATE ON transaction_limits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ---------------- İndeksler ------------------

-- users tablosunda email’e göre arama yaparken sistemin daha hızlı cevap vermesi için indeks
CREATE INDEX idx_users_email ON users(email);

-- Kullanıcı adlarına göre aramaları hızlandırmak için indeks
CREATE INDEX idx_users_username ON users(username);

-- accounts tablosunda user_id ile arama yaparken işlemi hızlandırmak için indeks
CREATE INDEX idx_accounts_user_id ON accounts(user_id);

-- Kart numarasına göre aramalar hızlı olsun diye indeks
CREATE INDEX idx_accounts_card_number ON accounts(card_number);

-- transactions tablosunda gönderici id’ye göre arama daha hızlı olsun diye indeks
CREATE INDEX idx_transactions_sender ON transactions(sender_id);

-- transactions tablosunda alıcı id’ye göre arama daha hızlı olsun diye indeks
CREATE INDEX idx_transactions_receiver ON transactions(receiver_id);

-- işlemler genelde tarih sırasına göre listelendiği için created_at alanına indeks
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- audit_logs tablosunda action’a göre sorgular hızlansın diye indeks
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- audit_logs tablosunda table_name’e göre arama yaparken hızlansın diye indeks
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);

-- audit_logs içinde belirli bir kaydı id’ye göre bulmak için indeks
CREATE INDEX idx_audit_logs_record_id ON audit_logs(record_id);

-- user_sessions tablosunda token’a göre arama yapılacaksa hız kazandırır
CREATE INDEX idx_user_sessions_token ON user_sessions(token);

-- user_sessions tablosunda user_id’ye göre sorgular hızlansın diye indeks
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);

-- ---------------- Roller ------------------

-- Sistemde iki tane varsayılan rol ekliyoruz:
-- admin => Sistem yöneticisi olacak
-- user => Normal kullanıcı olacak
-- Eğer zaten bu isimde bir rol varsa, hata vermesin diye "ON CONFLICT" kullanıyoruz.
INSERT INTO user_roles (name, description) VALUES
    ('admin', 'Sistem yöneticisi'),
    ('user', 'Normal kullanıcı')
ON CONFLICT (name) DO NOTHING; -- Eğer aynı isimde rol varsa boşver.
