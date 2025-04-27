import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { DatabaseService } from '../database/database.service';
import { UsersService } from './users.service';

const usersServiceInstance = new UsersService(new DatabaseService());

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: UsersService,
      useValue: usersServiceInstance,
    },
    DatabaseService,
  ],
  exports: [UsersService],
})
export class UsersModule {} 