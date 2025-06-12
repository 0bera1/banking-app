import { PoolClient } from 'pg';
import { DatabaseRepository } from './interfaces/database.interface';
export interface QueryResult<T = any> {
    rows: T[];
    rowCount: number;
}
export declare class DatabaseService implements DatabaseRepository {
    private readonly pool;
    constructor();
    private initializePool;
    query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>>;
    getClient(): Promise<PoolClient>;
    beginTransaction(client: PoolClient): Promise<void>;
    commitTransaction(client: PoolClient): Promise<void>;
    rollbackTransaction(client: PoolClient): Promise<void>;
    findOne<T = any>(table: string, id: number): Promise<T>;
    findAll<T = any>(table: string): Promise<T[]>;
    create<T = any>(table: string, data: Record<string, any>): Promise<T>;
    update<T = any>(table: string, id: number, data: Record<string, any>): Promise<T>;
    delete(table: string, id: number): Promise<void>;
}
