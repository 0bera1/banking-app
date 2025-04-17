import { PoolClient } from 'pg';
export declare class DatabaseService {
    private pool;
    constructor();
    query(text: string, params?: any[]): Promise<any>;
    getClient(): Promise<PoolClient>;
    beginTransaction(client: PoolClient): Promise<void>;
    commitTransaction(client: PoolClient): Promise<void>;
    rollbackTransaction(client: PoolClient): Promise<void>;
    findOne(table: string, id: number): Promise<any>;
    findAll(table: string): Promise<any[]>;
    create(table: string, data: Record<string, any>): Promise<any>;
    update(table: string, id: number, data: Record<string, any>): Promise<any>;
    delete(table: string, id: number): Promise<void>;
}
