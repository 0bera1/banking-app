import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(private readonly databaseService: DatabaseService) {}

  async log(
    action: string,
    tableName: string,
    recordId: string,
    oldData?: Record<string, any>,
    newData?: Record<string, any>,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
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

  async getLogs(
    tableName?: string,
    recordId?: string,
    action?: string,
    startDate?: Date,
    endDate?: Date,
    limit: number = 100,
    offset: number = 0,
  ): Promise<{ logs: AuditLog[]; total: number }> {
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

    // Toplam kayıt sayısını al
    const countQuery = query.replace(/SELECT.*?FROM/, 'SELECT COUNT(*) as total FROM');
    const countResult = await this.databaseService.query(countQuery, params);

    // Sayfalama ekle
    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await this.databaseService.query(query, params);

    return {
      logs: result.rows.map(row => ({
        ...row,
        oldData: row.oldData ? JSON.parse(row.oldData) : null,
        newData: row.newData ? JSON.parse(row.newData) : null,
      })),
      total: parseInt(countResult.rows[0].total),
    };
  }
} 