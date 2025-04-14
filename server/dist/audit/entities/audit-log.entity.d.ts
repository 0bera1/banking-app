export declare class AuditLog {
    id: string;
    action: string;
    tableName: string;
    recordId: string;
    oldData?: Record<string, any>;
    newData?: Record<string, any>;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
}
