import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    getLogs(req: any): Promise<{
        logs: import("./entities/audit-log.entity").AuditLog[];
        total: number;
    }>;
}
