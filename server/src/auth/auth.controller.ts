import { Controller, Post, Body, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

interface User {
  id: number;
  email: string;
  password_hash: string;
}

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}

    // Giriş işlemi
    @Post('login')
    async login(@Body() loginDto: { email: string; password: string }) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }

    // Kayıt işlemi
    @Post('register')
    async register(@Body() userData: { username: string; email: string; password: string; first_name: string; last_name: string }) {
        try {
            const user = await this.authService.register(
                userData.username,
                userData.email,
                userData.password,
                userData.first_name,
                userData.last_name
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