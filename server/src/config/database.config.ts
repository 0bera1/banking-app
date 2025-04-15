import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'banking_app',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
}; 