import { DatabaseService } from '../database/database.service';
import { AuditLog } from './entities/audit-log.entity';
interface LogActionParams {
    userId: number;
    action: string;
    details: Record<string, any>;
}
export declare class AuditService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    logAction({ userId, action, details }: LogActionParams): Promise<void>;
    log(action: string, tableName: string, recordId: string, oldData?: Record<string, any>, newData?: Record<string, any>, userId?: string, ipAddress?: string, userAgent?: string): Promise<void>;
    getLogs(tableName?: string, recordId?: string, action?: string, startDate?: Date, endDate?: Date, limit?: number, offset?: number): Promise<{
        logs: AuditLog[];
        total: number;
    }>;
    private safeJsonParse;
}
export {};
