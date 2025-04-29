import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { IUsersService } from "./interface/IUsersService";
export declare class UsersService implements IUsersService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(userData: CreateUserDto): Promise<UserResponseDto>;
    remove(id: number): Promise<void>;
    findOne(id: number): Promise<UserResponseDto>;
    findByEmail(email: string): Promise<UserResponseDto>;
    update(id: number, userData: UpdateUserDto): Promise<UserResponseDto>;
}
