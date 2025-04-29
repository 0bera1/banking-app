import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            role: any;
        };
    }>;
    getProfile(req: any): any;
}
