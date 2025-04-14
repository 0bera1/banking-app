import { DatabaseService } from '../database/database.service';
import { AuditLog } from './entities/audit-log.entity';
export declare class AuditService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    log(action: string, tableName: string, recordId: string, oldData?: Record<string, any>, newData?: Record<string, any>, userId?: string, ipAddress?: string, userAgent?: string): Promise<void>;
    getLogs(tableName?: string, recordId?: string, action?: string, startDate?: Date, endDate?: Date, limit?: number, offset?: number): Promise<{
        logs: AuditLog[];
        total: number;
    }>;
}
