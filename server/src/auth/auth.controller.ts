import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    private readonly authService: AuthService;

    public constructor(authService: AuthService) {
        this.authService = authService;
    }

    @Post('register')
    public async register(
        @Body('username') username: string,
        @Body('email') email: string,
        @Body('password') password: string,
        @Body('first_name') first_name: string,
        @Body('last_name') last_name: string
    ) {
        try {
            return await this.authService.register(username, email, password, first_name, last_name);
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    @Post('login')
    public async login(
        @Body('email') email: string,
        @Body('password') password: string
    ) {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('Kullanıcı bulunamadı veya şifre hatalı.');
        }
        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    public getProfile(@Req() req) {
        return req.user;
    }
} 