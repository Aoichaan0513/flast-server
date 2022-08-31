import { PrismaClient } from '@prisma/client';
import express from 'express';
import Profile from './routes/profile';
import Token from './routes/token';
import User from './routes/user';

export const SECRET_KEY = process.env.SECRET_KEY!!;
export const Database = new PrismaClient();

const App = express();

App.use(express.json());
App.use(express.urlencoded({ extended: true }));

App.use('/user', User);
App.use('/profile', Profile);
App.use('/token', Token);

App.listen(3000, () => {
    console.log('Server started!');
});
