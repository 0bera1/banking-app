"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
class AuditService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async logAction({ userId, action, details }) {
        var _a;
        const query = `
      INSERT INTO audit_logs 
      (user_id, action, table_name, record_id, new_data)
      VALUES ($1, $2, $3, $4, $5)
    `;
        await this.databaseService.query(query, [
            userId,
            action,
            'transactions',
            ((_a = details.transactionId) === null || _a === void 0 ? void 0 : _a.toString()) || '0',
            JSON.stringify(details)
        ]);
    }
    async log(action, tableName, recordId, oldData, newData, userId, ipAddress, userAgent) {
        const query = `
      INSERT INTO audit_logs 
      (action, table_name, record_id, old_data, new_data, user_id, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
        await this.databaseService.query(query, [
            action,
            tableName,
            recordId,
            oldData ? JSON.stringify(oldData) : null,
            newData ? JSON.stringify(newData) : null,
            userId,
            ipAddress,
            userAgent,
        ]);
    }
    async getLogs(tableName, recordId, action, startDate, endDate, limit = 100, offset = 0) {
        let query = `
      SELECT 
        id::text,
        action,
        table_name as "tableName",
        record_id as "recordId",
        old_data as "oldData",
        new_data as "newData",
        user_id as "userId",
        ip_address as "ipAddress",
        user_agent as "userAgent",
        created_at as "createdAt"
      FROM audit_logs
      WHERE 1=1
    `;
        const params = [];
        let paramIndex = 1;
        if (tableName) {
            query += ` AND table_name = $${paramIndex}`;
            params.push(tableName);
            paramIndex++;
        }
        if (recordId) {
            query += ` AND record_id = $${paramIndex}`;
            params.push(recordId);
            paramIndex++;
        }
        if (action) {
            query += ` AND action = $${paramIndex}`;
            params.push(action);
            paramIndex++;
        }
        if (startDate) {
            query += ` AND created_at >= $${paramIndex}`;
            params.push(startDate);
            paramIndex++;
        }
        if (endDate) {
            query += ` AND created_at <= $${paramIndex}`;
            params.push(endDate);
            paramIndex++;
        }
        query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);
        const result = await this.databaseService.query(query, params);
        const countQuery = query.replace(/SELECT.*?FROM/, 'SELECT COUNT(*) as total FROM')
            .replace(/ORDER BY.*$/, '');
        const countResult = await this.databaseService.query(countQuery, params.slice(0, -2));
        return {
            logs: result.rows.map(row => (Object.assign(Object.assign({}, row), { oldData: row.oldData ? this.safeJsonParse(row.oldData) : null, newData: row.newData ? this.safeJsonParse(row.newData) : null }))),
            total: parseInt(countResult.rows[0].total),
        };
    }
    safeJsonParse(data) {
        try {
            return typeof data === 'string' ? JSON.parse(data) : data;
        }
        catch (error) {
            console.error('Error parsing JSON:', error);
            return data;
        }
    }
}
exports.AuditService = AuditService;
//# sourceMappingURL=audit.service.js.map