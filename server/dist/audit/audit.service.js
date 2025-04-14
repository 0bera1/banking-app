"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let AuditService = class AuditService {
    constructor(databaseService) {
        this.databaseService = databaseService;
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
        id,
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
        const countQuery = query.replace(/SELECT.*?FROM/, 'SELECT COUNT(*) as total FROM');
        const countResult = await this.databaseService.query(countQuery, params);
        query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);
        const result = await this.databaseService.query(query, params);
        return {
            logs: result.rows.map(row => (Object.assign(Object.assign({}, row), { oldData: row.oldData ? JSON.parse(row.oldData) : null, newData: row.newData ? JSON.parse(row.newData) : null }))),
            total: parseInt(countResult.rows[0].total),
        };
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], AuditService);
//# sourceMappingURL=audit.service.js.map