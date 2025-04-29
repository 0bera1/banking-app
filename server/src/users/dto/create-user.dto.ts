export class CreateUserDto {
    public readonly username: string;
    public readonly email: string;
    public readonly password_hash: string;
    public readonly first_name?: string;
    public readonly last_name?: string;
    public readonly role?: string;
} 