import jwt from 'jsonwebtoken';
import { User } from '../interfaces';
import { SECRET_KEY } from '../main';

export const sign = (user: User) => jwt.sign(
    {
        id: user.id
    },
    SECRET_KEY,
    {
        algorithm: 'HS256',
        expiresIn: '2 weeks'
    }
);
