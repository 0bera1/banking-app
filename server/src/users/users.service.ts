import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) {}

    // Kullanıcı oluşturma
    async create(userData: any): Promise<any> {
        return await this.databaseService.create('users', userData);
    }

    // Kullanıcı silme
    async remove(id: number): Promise<void> {
        await this.databaseService.delete('users', id);
    }

    // Kullanıcı detayı görüntüleme
    async findOne(id: number): Promise<any> {
        return await this.databaseService.findOne('users', id);
    }

    // Email'e göre kullanıcı bulma
    async findByEmail(email: string): Promise<any> {
        const result = await this.databaseService.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }

    // Kullanıcı güncelleme
    async update(id: number, userData: any): Promise<any> {
        return await this.databaseService.update('users', id, userData);
    }
} 