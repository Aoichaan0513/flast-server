export interface User {
    id: number;
    name: string;
    avatar: string | null;
    email: string;
}

export interface UserWithToken extends User {
    token: string;
}

export interface Bookmark {
    id: number;
    title: string;
    url: string | null;
    favicon: string | null;
    folder: boolean;
    parentId: number | null;
}
