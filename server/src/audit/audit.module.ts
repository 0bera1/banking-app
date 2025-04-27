import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { DatabaseService } from '../database/database.service';

const auditServiceInstance = new AuditService(new DatabaseService());

@Module({
  providers: [
    {
      provide: AuditService,
      useValue: auditServiceInstance,
    },
    DatabaseService,
  ],
  controllers: [AuditController],
  exports: [AuditService],
})
export class AuditModule {} 