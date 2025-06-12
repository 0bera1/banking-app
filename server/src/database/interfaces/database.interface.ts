import { PoolClient } from 'pg';

export interface IDatabaseService {
    query<T = any>(sql: string, params?: any[]): Promise<{ rows: T[] }>;
    create(table: string, data: Record<string, unknown>): Promise<{ id: number }>;
    update(table: string, id: number, data: Record<string, unknown>): Promise<void>;
    delete(table: string, id: number): Promise<void>;
    findOne<T = any>(table: string, id: number): Promise<T>;
    findAll<T = any>(table: string): Promise<T[]>;
    findBy<T = any>(table: string, field: string, value: any): Promise<T[]>;
}

export interface DatabaseRepository {
    query<T>(text: string, params?: unknown[]): Promise<T>;
    getClient(): Promise<PoolClient>;
    beginTransaction(client: PoolClient): Promise<void>;
    commitTransaction(client: PoolClient): Promise<void>;
    rollbackTransaction(client: PoolClient): Promise<void>;
    findOne<T>(table: string, id: number): Promise<T>;
    findAll<T>(table: string): Promise<T[]>;
    create<T>(table: string, data: Record<string, unknown>): Promise<T>;
    update<T>(table: string, id: number, data: Record<string, unknown>): Promise<T>;
    delete(table: string, id: number): Promise<void>;
} 