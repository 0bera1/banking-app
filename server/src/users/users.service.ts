import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import {IUsersService} from "./interface/IUsersService";

export class UsersService implements IUsersService {
    private readonly databaseService: DatabaseService;

    public constructor(databaseService: DatabaseService) {
        this.databaseService = databaseService;
    }

    public async create(userData: CreateUserDto): Promise<UserResponseDto> {
        return await this.databaseService.create('users', userData);
    }

    public async remove(id: number): Promise<void> {
        await this.databaseService.delete('users', id);
    }

    public async findOne(id: number): Promise<UserResponseDto> {
        return await this.databaseService.findOne('users', id);
    }

    public async findByEmail(email: string): Promise<UserResponseDto> {
        const result = await this.databaseService.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }

    public async update(id: number, userData: UpdateUserDto): Promise<UserResponseDto> {
        return await this.databaseService.update('users', id, userData);
    }
} 