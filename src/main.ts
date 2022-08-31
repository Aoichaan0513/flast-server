import { PrismaClient } from '@prisma/client';
import express, { json, Response, urlencoded } from 'express';
import helmet from 'helmet';
import { Error, Request } from './interfaces/express';
import Profile from './routes/profile';
import Token from './routes/token';
import User from './routes/user';

export const SECRET_KEY = process.env.SECRET_KEY!!;
export const Database = new PrismaClient();

const App = express();

App.use(json());
App.use(urlencoded({ extended: true }));
App.use(helmet());

App.use('/user', User);
App.use('/profile', Profile);
App.use('/token', Token);

App.use((req: Request, res: Response<Error>) => {
    return res.status(404).send(
        {
            code: 10000,
            message: 'The specified path does not exist!'
        }
    );
});

App.listen(3000, () => {
    console.log('Server started!');
});
