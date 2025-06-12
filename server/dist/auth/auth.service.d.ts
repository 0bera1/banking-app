import { JwtService } from '@nestjs/jwt';
import { UserRepository } from "../users/interface/UserRepository";
import { AuthRepository } from "./interface/AuthRepository";
export declare class AuthService implements AuthRepository {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UserRepository, jwtService: JwtService);
    register(username: string, email: string, password: string, first_name: string, last_name: string): Promise<{
        id: number;
        username: string;
        email: string;
        first_name?: string;
        last_name?: string;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        lastLoginAt?: Date;
    }>;
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            role: any;
        };
    }>;
    verifyToken(token: string): Promise<any>;
    hashPassword(password: string): Promise<string>;
}
