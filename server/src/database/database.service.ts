import { Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class DatabaseService {
  // PostgreSQL bağlantı havuzu
  // Pool, veritabanı bağlantılarını yönetmek için kullanılır
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: 'postgres', // PostgreSQL kullanıcı adı
      host: 'localhost', // PostgreSQL sunucu adresi
      database: 'banking_app', // Veritabanı adı
      password: 'postgres', // PostgreSQL şifresi
      port: 5432, // PostgreSQL port numarası
    });
  }

  // Veritabanı sorgularını çalıştırmak için genel bir metot
  // text: SQL sorgusu
  // params: Sorgu parametreleri (SQL injection'ı önlemek için)
  async query(text: string, params?: any[]) {
    // Sorgu başlangıç zamanını kaydediyoruz (performans ölçümü için)
    const start = Date.now();
    // Sorguyu çalıştırıyoruz ve sonucu bekliyoruz
    const res = await this.pool.query(text, params);
    // Sorgu süresini hesaplıyoruz
    const duration = Date.now() - start;
    // Sorgu bilgilerini konsola yazdırıyoruz (debugging için)
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  }

  // Transaction yönetimi için client alma metodu
  async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }
}