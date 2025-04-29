import {Controller, Get, Query, UseGuards} from '@nestjs/common';
import {AuditService} from './audit.service';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';

@Controller('audit')
@UseGuards(JwtAuthGuard)
export class AuditController {
    private readonly auditService: AuditService;

    public constructor(auditService: AuditService) {
        this.auditService = auditService;
    }

    @Get('logs')
    public getLogs(@Query('tableName') tableName?: string,
                   @Query('recordId') recordId?: string,
                   @Query('action') action?: string,
                   @Query('startDate') startDate?: Date,
                   @Query('endDate') endDate?: Date,
                   @Query('limit') limit?: number,
                   @Query('offset') offset?: number,
    ) {
        return this.auditService.getLogs(
            tableName,
            recordId,
            action,
            startDate,
            endDate,
            limit,
            offset
        );
    }
} 