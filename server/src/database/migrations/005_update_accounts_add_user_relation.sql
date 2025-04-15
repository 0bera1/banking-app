-- Accounts tablosuna user_id kolonu ekleme
ALTER TABLE accounts
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);

-- Mevcut hesaplar için geçici bir kullanıcı oluştur
DO $$
DECLARE
    temp_user_id INTEGER;
BEGIN
    -- Geçici kullanıcı oluştur
    INSERT INTO users (username, email, password_hash, first_name, last_name, role)
    VALUES ('system', 'system@bank.com', 'system', 'System', 'User', 'admin')
    ON CONFLICT (email) DO UPDATE SET username = EXCLUDED.username
    RETURNING id INTO temp_user_id;

    -- Sahipsiz hesapları geçici kullanıcıya bağla
    UPDATE accounts SET user_id = temp_user_id WHERE user_id IS NULL;
END $$;

-- user_id kolonunu zorunlu yap
ALTER TABLE accounts
ALTER COLUMN user_id SET NOT NULL;

-- İndeks oluştur
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id); 