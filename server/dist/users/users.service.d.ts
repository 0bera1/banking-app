import { DatabaseService } from '../database/database.service';
export declare class UsersService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(userData: any): Promise<any>;
    remove(id: number): Promise<void>;
    findOne(id: number): Promise<any>;
    findByEmail(email: string): Promise<any>;
    update(id: number, userData: any): Promise<any>;
}
