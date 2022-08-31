import { User } from '../interfaces';

declare module 'express' {

    export interface Request {
        token?: string;
        user?: User;
    }
}
