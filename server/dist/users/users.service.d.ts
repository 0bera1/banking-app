import { DatabaseService } from '../database/database.service';
export interface IUsersService {
    create(userData: any): Promise<any>;
    remove(id: number): Promise<void>;
    findOne(id: number): Promise<any>;
    findByEmail(email: string): Promise<any>;
    update(id: number, userData: any): Promise<any>;
}
export declare class UsersService implements IUsersService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(userData: any): Promise<any>;
    remove(id: number): Promise<void>;
    findOne(id: number): Promise<any>;
    findByEmail(email: string): Promise<any>;
    update(id: number, userData: any): Promise<any>;
}
