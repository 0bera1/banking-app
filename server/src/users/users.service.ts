import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface IUsersService {
    create(userData: any): Promise<any>;
    remove(id: number): Promise<void>;
    findOne(id: number): Promise<any>;
    findByEmail(email: string): Promise<any>;
    update(id: number, userData: any): Promise<any>;
}

export class UsersService implements IUsersService {
    private readonly databaseService: DatabaseService;

    public constructor(databaseService: DatabaseService) {
        this.databaseService = databaseService;
    }

    public async create(userData: any): Promise<any> {
        return await this.databaseService.create('users', userData);
    }

    public async remove(id: number): Promise<void> {
        await this.databaseService.delete('users', id);
    }

    public async findOne(id: number): Promise<any> {
        return await this.databaseService.findOne('users', id);
    }

    public async findByEmail(email: string): Promise<any> {
        const result = await this.databaseService.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }

    public async update(id: number, userData: any): Promise<any> {
        return await this.databaseService.update('users', id, userData);
    }
} 