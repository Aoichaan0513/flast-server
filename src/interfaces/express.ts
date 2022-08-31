import { Request as BaseRequest } from 'express';

export interface Request<T = any> extends BaseRequest {
    body: T;
}

export interface Error {
    code: string | number;
    message: string;
}
