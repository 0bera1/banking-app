import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // Yeni kullanıcı oluşturma
    @Post()
    async create(@Body() userData: Partial<User>): Promise<User> {
        try {
            return await this.usersService.create(userData);
        } catch (error) {
            if (error.code === '23505') { // Unique constraint violation
                throw new HttpException('This email or username is already in use', HttpStatus.CONFLICT);
            }
            throw new HttpException('Error creating user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Kullanıcı detayı görüntüleme
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        try {
            return await this.usersService.findOne(+id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Error fetching user details', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Kullanıcı güncelleme
    @Put(':id')
    async update(@Param('id') id: string, @Body() userData: Partial<User>): Promise<User> {
        try {
            return await this.usersService.update(+id, userData);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Error updating user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Kullanıcı silme
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        try {
            await this.usersService.remove(+id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Error deleting user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 