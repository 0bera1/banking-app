import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class AccountExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AccountExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        const errorResponse = {
            statusCode: status,
            zaman: new Date().toISOString(),
            yol: request.url,
            metod: request.method,
            mesaj: exception.message,
            hata: exception.name
        };

        this.logger.error(
            `${request.method} ${request.url} - ${status} - ${exception.message}`,
            exception.stack
        );

        response
            .status(status)
            .json(errorResponse);
    }
} 