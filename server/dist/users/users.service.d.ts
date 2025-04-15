import { DatabaseService } from '../database/database.service';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(userData: Partial<User>): Promise<User>;
    remove(id: number): Promise<void>;
    findOne(id: number): Promise<User>;
    findByEmail(email: string): Promise<User>;
    update(id: number, userData: Partial<User>): Promise<User>;
}
