export class UserResponseDto {
    public readonly id: number;
    public readonly username: string;
    public readonly email: string;
    public readonly password_hash: string;
    public readonly first_name?: string;
    public readonly last_name?: string;
    public readonly role: string;
    public readonly isActive: boolean;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
    public readonly lastLoginAt?: Date;
} 