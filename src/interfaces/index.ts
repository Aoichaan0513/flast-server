export interface User {
    id: number;
    name: string;
    avatar: string | null;
    email: string;
}

export interface UserWithToken extends User {
    token: string;
}
