import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    getLogs(tableName?: string, recordId?: string, action?: string, startDate?: Date, endDate?: Date, limit?: number, offset?: number): Promise<{
        logs: import("./entities/audit-log.entity").AuditLog[];
        total: number;
    }>;
}
