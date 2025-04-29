import { JwtService } from '@nestjs/jwt';
import { IUsersService } from "../users/interface/IUsersService";
export interface IAuthService {
    register(username: string, email: string, password: string, first_name: string, last_name: string): Promise<any>;
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: any;
    }>;
    verifyToken(token: string): Promise<any>;
    hashPassword(password: string): Promise<string>;
}
export declare class AuthService implements IAuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: IUsersService, jwtService: JwtService);
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
