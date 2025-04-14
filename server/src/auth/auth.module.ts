import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [],
  exports: []
})
export class AuthModule {} 