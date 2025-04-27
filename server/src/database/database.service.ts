import { Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class DatabaseService {
  // PostgreSQL bağlantı havuzu
  // Pool, veritabanı bağlantılarını yönetmek için kullanılır
  private pool: Pool;

  constructor() {
    console.log('Initializing database connection with config:', {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'banking_app',
        port: parseInt(process.env.DB_PORT || '5432')
    });

    this.pool = new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'banking_app',
        password: process.env.DB_PASSWORD || 'postgres',
        port: parseInt(process.env.DB_PORT || '5432'),
    });

    this.pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
    });

    this.pool.on('connect', () => {
        console.log('New client connected to database');
    });
  }

  // Veritabanı sorgularını çalıştırmak için genel bir metot
  // text: SQL sorgusu
  // params: Sorgu parametreleri (SQL injection'ı önlemek için)
  async query(text: string, params?: any): Promise<any> {
    const start = Date.now();
    try {
        console.log('Executing query:', text);
        console.log('With params:', params);
        
        if (!this.pool) {
            console.error('Database pool is not initialized');
            throw new Error('Veritabanı bağlantısı başlatılmadı');
        }
        
        const res = await this.pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Query executed successfully', {
            text,
            params,
            duration,
            rowCount: res.rowCount,
            rows: res.rows
        });
        return res;
    } catch (error) {
        console.error('Error executing query:', {
            text,
            params,
            error: {
                message: error.message,
                code: error.code,
                stack: error.stack
            }
        });
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