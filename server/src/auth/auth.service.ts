import {UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {IUsersService} from "../users/interface/IUsersService";
import {UserResponseDto} from "../users/dto/user-response.dto";

export interface IAuthService {
    register(username: string, email: string, password: string, first_name: string, last_name: string): Promise<any>;

    validateUser(email: string, password: string): Promise<any>;

    login(user: any): Promise<{ access_token: string; user: any }>;

    verifyToken(token: string): Promise<any>;

    hashPassword(password: string): Promise<string>;
}

export class AuthService implements IAuthService {
    private readonly usersService: IUsersService;
    private readonly jwtService: JwtService;

    public constructor(
        usersService: IUsersService,
        jwtService: JwtService,
    ) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }

    public async register(username: string, email: string, password: string, first_name: string, last_name: string) {
        try {
            console.log('Registering user:', {username, email, first_name, last_name});
            const hashedPassword: string = await this.hashPassword(password);
            console.log('Password hashed successfully');
            const user: UserResponseDto = await this.usersService.create({
                username,
                email,
                password_hash: hashedPassword,
                first_name,
                last_name
            });
            console.log('User created successfully:', user);

            const {password_hash, ...result} = user;
            return result;
        } catch (error) {
            console.error('Error in register:', error);
            throw new Error('Error registering: ' + error.message);
        }
    }

    public async validateUser(email: string, password: string): Promise<any> {
        const user:UserResponseDto = await this.usersService.findByEmail(email);

        if (user && await bcrypt.compare(password, user.password_hash)) {
            const {password_hash, ...result} = user;
            return result;
        }

        return null;
    }

    public async login(user: any) {
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

    public async verifyToken(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    public async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
} 