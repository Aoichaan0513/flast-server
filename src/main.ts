import { PrismaClient } from '@prisma/client';
import express from 'express';
import Profile from './routes/profile';
import Users from './routes/users';

export const SECRET_KEY = 'a1b2c3';
export const Database = new PrismaClient();

const App = express();

App.use(express.json());
App.use(express.urlencoded({ extended: true }));

App.use('/users', Users);
App.use('/profile', Profile);

App.listen(3000, () => {
    console.log('Server started!');
});
