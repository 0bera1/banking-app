import { Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class DatabaseService {
  // PostgreSQL bağlantı havuzu
  // Pool, veritabanı bağlantılarını yönetmek için kullanılır
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'banking_app',
      password: process.env.DB_PASSWORD || 'postgres',
      port: parseInt(process.env.DB_PORT || '5432'),
    });
  }

  // Veritabanı sorgularını çalıştırmak için genel bir metot
  // text: SQL sorgusu
  // params: Sorgu parametreleri (SQL injection'ı önlemek için)
  async query(text: string, params?: any[]): Promise<any> {
    // Sorgu başlangıç zamanını kaydediyoruz (performans ölçümü için)
    const start = Date.now();
    try {
      // Sorguyu çalıştırıyoruz ve sonucu bekliyoruz
      console.log('Executing query:', text);
      console.log('With params:', params);
      const res = await this.pool.query(text, params);
      // Sorgu süresini hesaplıyoruz
      const duration = Date.now() - start;
      // Sorgu bilgilerini konsola yazdırıyoruz (debugging için)
      console.log('Query executed successfully', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  // Transaction yönetimi için client alma metodu
  async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  async beginTransaction(client: PoolClient): Promise<void> {
    await client.query('BEGIN');
  }

  async commitTransaction(client: PoolClient): Promise<void> {
    await client.query('COMMIT');
  }

  async rollbackTransaction(client: PoolClient): Promise<void> {
    await client.query('ROLLBACK');
  }

  async findOne(table: string, id: number): Promise<any> {
    const result = await this.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
    return result.rows[0];
  }

  async findAll(table: string): Promise<any[]> {
    const result = await this.query(`SELECT * FROM ${table}`);
    return result.rows;
  }

  async create(table: string, data: Record<string, any>): Promise<any> {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    
    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.query(query, values);
    return result.rows[0];
  }

  async update(table: string, id: number, data: Record<string, any>): Promise<any> {
    const setClause = Object.keys(data)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');
    
    const values = [...Object.values(data), id];
    const query = `UPDATE ${table} SET ${setClause} WHERE id = $${values.length} RETURNING *`;
    
    const result = await this.query(query, values);
    return result.rows[0];
  }

  async delete(table: string, id: number): Promise<void> {
    await this.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  }
}