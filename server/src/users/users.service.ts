import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import {UserRepository} from "./interface/UserRepository";

@Injectable()
export class UsersService implements UserRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async create(userData: CreateUserDto): Promise<any> {
        const data = {
            ...userData,
            created_at: new Date(),
            updated_at: new Date()
        };
        return await this.databaseService.create('users', data);
    }

    async findOne(id: number): Promise<any> {
        const result = await this.databaseService.query(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    async update(id: number, userData: UpdateUserDto): Promise<any> {
        const data = {
            ...userData,
            updated_at: new Date()
        };
        return await this.databaseService.update('users', id, data);
    }

    async remove(id: number): Promise<void> {
        await this.databaseService.delete('users', id);
    }

    public async findByEmail(email: string): Promise<UserResponseDto> {
        const result = await this.databaseService.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }
} 