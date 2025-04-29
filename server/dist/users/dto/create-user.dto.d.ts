export declare class CreateUserDto {
    readonly username: string;
    readonly email: string;
    readonly password_hash: string;
    readonly first_name?: string;
    readonly last_name?: string;
    readonly role?: string;
}
