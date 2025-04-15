import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AuditLog } from './entities/audit-log.entity';

interface LogActionParams {
  userId: number;
  action: string;
  details: Record<string, any>;
}

@Injectable()
export class AuditService {
  constructor(private readonly databaseService: DatabaseService) {}

  async logAction({ userId, action, details }: LogActionParams): Promise<void> {
    const query = `
      INSERT INTO audit_logs 
      (user_id, action, table_name, record_id, new_data)
      VALUES ($1, $2, $3, $4, $5)
    `;

    await this.databaseService.query(query, [
      userId,
      action,
      'transactions',
      details.transactionId?.toString() || '0',
      JSON.stringify(details)
    ]);
  }

  // log() metodu, bir işlem gerçekleştiğinde bu işlemi audit_logs tablosuna kaydeder.
  async log(
    action: string, // işlem tipi (CREATE, UPDATE, DELETE)
    tableName: string, // işlem yapılan tablo adı
    recordId: string, // işlem yapılan kaydın ID'si
    oldData?: Record<string, any>, // Eski veri
    newData?: Record<string, any>, // Yeni veri
    userId?: string, // kullanıcının ID'si
    ipAddress?: string, //  IP adresi
    userAgent?: string, // cihaz bilgisi
  ): Promise<void> {
    // Audit log kaydı için SQL sorgusu hazırlanıyor.
    const query = `
      INSERT INTO audit_logs 
      (action, table_name, record_id, old_data, new_data, user_id, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    // Parametreler sırayla diziye ekleniyor.
    await this.databaseService.query(query, [
      action,
      tableName,
      recordId,
      oldData ? JSON.stringify(oldData) : null,  // oldData varsa JSON string olarak kaydedilir, yoksa null.
      newData ? JSON.stringify(newData) : null,  // newData   "     "     "     "       "           "   ""
      userId,
      ipAddress,
      userAgent,
    ]);
  }

  // getLogs() metodu, audit_logs tablosundan işlem geçmişlerini getirir.
  async getLogs(
    tableName?: string,
    recordId?: string,
    action?: string,
    startDate?: Date, 
    endDate?: Date,
    limit: number = 100,
    offset: number = 0,
  ): Promise<{ logs: AuditLog[]; total: number }> { 

    // Dinamik olarak filtre eklemek için başlangıç sorgusu.
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

    // Eğer tableName gönderildiyse, filtreye eklenir.
    if (tableName) {
      query += ` AND table_name = $${paramIndex}`;
      params.push(tableName);
      paramIndex++;
    }

    // Eğer recordId gönderildiyse, filtreye eklenir.
    if (recordId) {
      query += ` AND record_id = $${paramIndex}`;
      params.push(recordId);
      paramIndex++;
    }

    // Eğer action gönderildiyse, filtreye eklenir.
    if (action) {
      query += ` AND action = $${paramIndex}`;
      params.push(action);
      paramIndex++;
    }

    // Eğer startDate gönderildiyse, filtreye eklenir.
    if (startDate) {
      query += ` AND created_at >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    // Eğer endDate gönderildiyse, filtreye eklenir.
    if (endDate) {
      query += ` AND created_at <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    // Sonuçları sıralayıp, sayfalama işlemi için LIMIT ve OFFSET eklenir.
    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset); // Limit ve offset parametre olarak eklenir.

    // Log verileri veritabanından çekilir.
    const result = await this.databaseService.query(query, params);

    // Toplam kayıt sayısını öğrenmek için sorgunun SELECT kısmı değiştirilir.
    const countQuery = query.replace(/SELECT.*?FROM/, 'SELECT COUNT(*) as total FROM')
                           .replace(/ORDER BY.*$/, '');

    // Toplam sayıyı veritabanından çeker.
    const countResult = await this.databaseService.query(countQuery, params.slice(0, -2));

    // Sonuçlar JSON parse
    return {
      logs: result.rows.map(row => ({
        ...row,
        oldData: row.oldData ? this.safeJsonParse(row.oldData) : null,
        newData: row.newData ? this.safeJsonParse(row.newData) : null,
      })),
      total: parseInt(countResult.rows[0].total),
    };
  }

  private safeJsonParse(data: any): any {
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return data;
    }
  }
}
