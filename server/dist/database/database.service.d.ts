import { PoolClient } from 'pg';
export declare class DatabaseService {
    private pool;
    constructor();
    query(text: string, params?: any[]): Promise<any>;
    getClient(): Promise<PoolClient>;
}
