import { IsOptional, IsUUID, IsNumber, Min, Max } from 'class-validator';

export class GetTransactionsDto {
  @IsUUID()
  @IsOptional()
  accountId?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsNumber()
  @IsOptional()
  @Min(0)
  offset?: number = 0;
} 