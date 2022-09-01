import { Request as BaseRequest } from 'express';
import { ValidationError } from 'express-validator';

export interface BodyRequest<T = any> extends BaseRequest {
    body: T;
}

export interface Error {
    code: string | number;
    message: string;
}

export interface ValidatorError {
    errors: ValidationError[];
}
