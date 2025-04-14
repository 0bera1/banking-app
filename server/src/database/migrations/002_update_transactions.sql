-- Transactions tablosunu güncelle
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS description TEXT; 