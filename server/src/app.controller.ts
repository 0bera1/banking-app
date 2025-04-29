import { Controller, Get } from '@nestjs/common';
import { appService } from './service.factory';
import {AppService} from "./app.service";

@Controller()
export class AppController {
  private readonly appService :AppService = appService;

  @Get()
  public getHello(): string {
    return this.appService.getHello();
  }
} 