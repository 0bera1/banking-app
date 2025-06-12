import {CreateUserDto} from "../dto/create-user.dto";
import {UserResponseDto} from "../dto/user-response.dto";
import {UpdateUserDto} from "../dto/update-user.dto";

export interface UserRepository {
    create(userData: CreateUserDto): Promise<UserResponseDto>;
    remove(id: number): Promise<void>;
    findOne(id: number): Promise<UserResponseDto>;
    findByEmail(email: string): Promise<UserResponseDto>;
    update(id: number, userData: UpdateUserDto): Promise<UserResponseDto>;
}