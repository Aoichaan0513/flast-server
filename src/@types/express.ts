import { User } from '../interfaces';

declare module 'express' {
    export interface Request {
        user?: User;
    }
}
