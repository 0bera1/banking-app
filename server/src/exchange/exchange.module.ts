import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';
import { DatabaseService } from '../database/database.service';

const exchangeServiceInstance = new ExchangeService(new DatabaseService());

@Module({
  controllers: [ExchangeController],
  providers: [{provide: ExchangeService,useValue: exchangeServiceInstance,},DatabaseService,],
  exports: [ExchangeService],
})
export class ExchangeModule {} 