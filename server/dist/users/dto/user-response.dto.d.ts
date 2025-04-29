export declare class UserResponseDto {
    readonly id: number;
    readonly username: string;
    readonly email: string;
    readonly password_hash: string;
    readonly first_name?: string;
    readonly last_name?: string;
    readonly role: string;
    readonly isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly lastLoginAt?: Date;
}
