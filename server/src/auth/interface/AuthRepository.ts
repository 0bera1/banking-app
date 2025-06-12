
export interface AuthRepository {
    register(username: string, email: string, password: string, first_name: string, last_name: string): Promise<any>;
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{ access_token: string; user: any }>;
    verifyToken(token: string): Promise<any>;
    hashPassword(password: string): Promise<string>;
}
