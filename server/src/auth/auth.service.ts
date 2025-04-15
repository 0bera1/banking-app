import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    // Kullanıcı kaydı
    async register(username: string, email: string, password: string) {
        try {
            console.log('Registering user:', { username, email });
            const hashedPassword = await this.hashPassword(password);
            console.log('Password hashed successfully');
            const user = await this.usersService.create({
                username,
                email,
                password_hash: hashedPassword,
            });
            console.log('User created successfully:', user);
            
            const { password_hash, ...result } = user;
            return result;
        } catch (error) {
            console.error('Error in register:', error);
            throw new Error('Error registering: ' + error.message);
        }
    }

    // Kullanıcı doğrulama
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        
        if (user && await bcrypt.compare(password, user.password_hash)) {
            const { password_hash, ...result } = user;
            return result;
        }
        
        return null;
    }

    // Giriş işlemi
    async login(user: any) {
        const payload = { 
            email: user.email, 
            sub: user.id,
            role: user.role 
        };
        
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };
    }

    // Token doğrulama
    async verifyToken(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    // Şifre hashleme
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
} 