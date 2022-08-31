import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { Database, SECRET_KEY } from '../main';

export const authorization = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.header('Authorization');
    if (!header) {
        return res.status(401).send(
            {
                code: 10000,
                message: 'Authorization header not specified!'
            }
        );
    }

    if (!header.startsWith('Bearer ')) {
        return res.status(400).send(
            {
                code: 10001,
                message: 'The format of the authentication header is incorrect! The authentication method must be Bearer.'
            }
        );
    }

    const token = header.split(' ')[1];

    try {
        const payload = verify(token, SECRET_KEY);
        console.log(payload);
        if (typeof payload === 'object') {
            const userId = payload.id;
            const user = await Database.user.findUnique({
                where: {
                    id: userId
                }
            });

            if (!user) {
                return res.status(404).send(
                    {
                        code: 10003,
                        message: 'There is no user associated with the token!'
                    }
                );
            }

            req.user = {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                email: user.email
            };

            return next();
        } else {
            return res.status(400).send(
                {
                    code: 10002,
                    message: 'Token parsing failed!'
                }
            );
        }
    } catch (e) {
        return res.status(400).send(
            {
                code: 10002,
                message: 'Token parsing failed!'
            }
        );
    }
};
