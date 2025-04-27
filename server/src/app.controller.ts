import { Controller, Get } from '@nestjs/common';
import { appService } from './service.factory';

@Controller()
export class AppController {
  private readonly appService = appService;

  @Get()
  public getHello(): string {
    return this.appService.getHello();
  }
} 