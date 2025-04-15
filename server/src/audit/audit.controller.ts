import { Controller, Get, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('audit')
@UseGuards(JwtAuthGuard)
export class AuditController {
    constructor(private readonly auditService: AuditService) {}

    @Get()
    async getLogs(@Request() req) {
        try {
            // Tüm logları getir, user_id'ye göre filtreleme yapmadan
            return await this.auditService.getLogs();
        } catch (error) {
            console.error('Error in getLogs:', error);
            throw new HttpException(`Error getting logs: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 