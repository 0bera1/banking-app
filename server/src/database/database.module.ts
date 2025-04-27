import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

const databaseServiceInstance = new DatabaseService();

@Module({
  providers: [
    {
      provide: DatabaseService,
      useValue: databaseServiceInstance,
    },
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
