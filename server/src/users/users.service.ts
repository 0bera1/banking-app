import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) {}

    // Kullanıcı oluşturma
    async create(userData: Partial<User>): Promise<User> {
        try {
            console.log('Creating user with data:', userData);
            const query = `
                INSERT INTO users 
                (username, email, password_hash, first_name, last_name, role)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `;
            
            const values = [
                userData.username,
                userData.email,
                userData.password_hash,
                userData.first_name || '',
                userData.last_name || '',
                userData.role || 'user'
            ];

            console.log('Executing query:', query);
            console.log('With values:', values);

            const result = await this.databaseService.query(query, values);
            console.log('Query result:', result);
            return result.rows[0];
        } catch (error) {
            console.error('Error in create:', error);
            throw error;
        }
    }

    // Kullanıcı silme
    async remove(id: number): Promise<void> {
        const query = 'DELETE FROM users WHERE id = $1';
        await this.databaseService.query(query, [id]);
    }

    // Kullanıcı detayı görüntüleme
    async findOne(id: number): Promise<User> {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await this.databaseService.query(query, [id]);
        
        if (!result.rows[0]) {
            throw new NotFoundException('User not found');
        }
        
        return result.rows[0];
    }

    // Email'e göre kullanıcı bulma
    async findByEmail(email: string): Promise<User> {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await this.databaseService.query(query, [email]);
        return result.rows[0];
    }

    // Kullanıcı güncelleme
    async update(id: number, userData: Partial<User>): Promise<User> {
        const fields = [];
        const values = [];
        let valueIndex = 1;

        Object.entries(userData).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = $${valueIndex}`);
                values.push(value);
                valueIndex++;
            }
        });

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        const query = `
            UPDATE users 
            SET ${fields.join(', ')}
            WHERE id = $${valueIndex}
            RETURNING *
        `;

        values.push(id);
        const result = await this.databaseService.query(query, values);
        
        if (!result.rows[0]) {
            throw new NotFoundException('User not found');
        }

        return result.rows[0];
    }
} 