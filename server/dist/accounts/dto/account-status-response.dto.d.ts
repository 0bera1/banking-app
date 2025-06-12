export interface AccountStatusResponse {
    id: number;
    status: 'active' | 'inactive' | 'blocked';
    message: string;
}
