import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
export declare class AccountExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: HttpException, host: ArgumentsHost): void;
}
