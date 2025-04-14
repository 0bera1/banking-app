// NestJS'den gerekli servis decorator'ını import ediyoruz
import { Injectable } from '@nestjs/common';
// PostgreSQL bağlantı havuzu için pg modülünü import ediyoruz
import { Pool, PoolClient } from 'pg';

// @Injectable decorator'u ile servisi tanımlıyoruz
// Bu decorator, bu servisin NestJS'in dependency injection sisteminde kullanılabileceğini belirtir
@Injectable()
export class DatabaseService {
  // PostgreSQL bağlantı havuzunu tanımlıyoruz
  // Pool, veritabanı bağlantılarını yönetmek için kullanılır
  private pool: Pool;

  // Constructor'da bağlantı havuzunu oluşturuyoruz
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
    // Sonucu döndürüyoruz
    return res;
  }

  // Transaction yönetimi için client alma metodu
  async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }
}