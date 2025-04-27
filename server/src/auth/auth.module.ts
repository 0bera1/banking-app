import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DatabaseService } from '../database/database.service';

const databaseServiceInstance = new DatabaseService();
const jwtServiceInstance = new JwtService({ secret: process.env.JWT_SECRET || 'your-secret-key' });
const usersServiceInstance = new UsersService(databaseServiceInstance);
const authServiceInstance = new AuthService(usersServiceInstance, jwtServiceInstance);

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthService,
      useValue: authServiceInstance,
    },
    {
      provide: UsersService,
      useValue: usersServiceInstance,
    },
    {
      provide: JwtService,
      useValue: jwtServiceInstance,
    },
    {
      provide: DatabaseService,
      useValue: databaseServiceInstance,
    },
    JwtStrategy,
  ],
  exports: [AuthService]
})
export class AuthModule {} 