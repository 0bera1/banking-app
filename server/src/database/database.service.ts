import { Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { DatabaseRepository } from './interfaces/database.interface';

export interface QueryResult<T = any> {
    rows: T[];
    rowCount: number;
}

@Injectable()
export class DatabaseService implements DatabaseRepository {
  private readonly pool: Pool;

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

    this.initializePool();
  }

  private initializePool(): void {
    this.pool.on('error', (err: Error): void => {
        console.error('Unexpected error on idle client', err);
    });

    this.pool.on('connect', (): void => {
        console.log('New client connected to database');
    });
  }

  public async query<T>(text: string, params?: unknown[]): Promise<QueryResult<T>> {
    const start: number = Date.now();
    try {
        console.log('Executing query:', text);
        console.log('With params:', params);
        
        if (!this.pool) {
            console.error('Database pool is not initialized');
            throw new Error('Veritabanı bağlantısı başlatılmadı');
        }
        
        const res = await this.pool.query(text, params);
        const duration: number = Date.now() - start;
        
        console.log('Query executed successfully', {
            text,
            params,
            duration,
            rowCount: res.rowCount
        });
        
        return res;
    } catch (error) {
        console.error('Error executing query:', {
            text,
            params,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
    }
  }

  public async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  public async beginTransaction(client: PoolClient): Promise<void> {
    await client.query('BEGIN');
  }

  public async commitTransaction(client: PoolClient): Promise<void> {
    await client.query('COMMIT');
  }

  public async rollbackTransaction(client: PoolClient): Promise<void> {
    await client.query('ROLLBACK');
  }

  public async findOne<T = any>(table: string, id: number): Promise<T> {
    const result = await this.query<T>(`SELECT * FROM ${table} WHERE id = $1`, [id]);
    return result.rows[0];
  }

  public async findAll<T = any>(table: string): Promise<T[]> {
    const result = await this.query<T>(`SELECT * FROM ${table}`);
    return result.rows;
  }

  public async create<T = any>(table: string, data: Record<string, any>): Promise<T> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const columnNames = columns.join(', ');

    const query = `
        INSERT INTO ${table} (${columnNames})
        VALUES (${placeholders})
        RETURNING *
    `;

    const result = await this.query<T>(query, values);
    return result.rows[0];
  }

  public async update<T = any>(table: string, id: number, data: Record<string, any>): Promise<T> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, i) => `${col} = $${i + 2}`).join(', ');

    const query = `
        UPDATE ${table}
        SET ${setClause}
        WHERE id = $1
        RETURNING *
    `;

    const result = await this.query<T>(query, [id, ...values]);
    return result.rows[0];
  }

  public async delete(table: string, id: number): Promise<void> {
    await this.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  }
}