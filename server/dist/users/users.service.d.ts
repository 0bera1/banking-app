import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserRepository } from "./interface/UserRepository";
export declare class UsersService implements UserRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(userData: CreateUserDto): Promise<any>;
    findOne(id: number): Promise<any>;
    update(id: number, userData: UpdateUserDto): Promise<any>;
    remove(id: number): Promise<void>;
    findByEmail(email: string): Promise<UserResponseDto>;
}
