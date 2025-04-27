import { IUsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
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
    register(username: string, email: string, password: string, first_name: string, last_name: string): Promise<any>;
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
