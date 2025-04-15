import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}

    // Giriş işlemi
    @Post('login')
    async login(@Body() loginData: { email: string; password: string }) {
        try {
            const user = await this.authService.validateUser(loginData.email, loginData.password);
            
            if (!user) {
                throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
            }

            return this.authService.login(user);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Error logging in', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Kayıt işlemi
    @Post('register')
    async register(@Body() userData: { username: string; email: string; password: string }) {
        try {
            const user = await this.authService.register(
                userData.username,
                userData.email,
                userData.password
            );
            
            return this.authService.login(user);
        } catch (error) {
            console.error('Registration error:', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(`Error registering: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 