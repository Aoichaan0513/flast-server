import { Prisma } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import { User, UserWithToken } from '../interfaces';
import { BodyRequest, Error, ValidatorError } from '../interfaces/express';
import { Database } from '../main';
import { sign } from '../utils/jwt';

const router = Router();

interface CreateUserBody extends Pick<User, 'name' | 'email'> {
    password: string;
}

router.put('/', [body('email').isEmail()], async (req: BodyRequest<CreateUserBody>, res: Response<UserWithToken | Error | ValidatorError>) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    try {
        const user = await Database.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: await hash(req.body.password, 10)
            }
        });

        const jwtToken = sign(user);

        const token = await Database.token.create({
            data: {
                userId: user.id,
                token: jwtToken
            }
        });

        console.log(user);

        return res.status(201).send(
            {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                email: user.email,
                token: token.token
            }
        );
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return res.status(e.code === 'P2002' ? 409 : 500).send(
                {
                    code: e.code,
                    message: 'Couldn\'t create account due to table constraints! This occurs, for example, when you try to register with an email address that is already registered.'
                }
            );
        } else {
            return res.status(500).send({ code: 10001, message: 'Unknown error!' });
        }
    }
});

interface LoginUserBody {
    email: string;
    password: string;
}

router.post('/', [body('email').isEmail()], async (req: BodyRequest<LoginUserBody>, res: Response<UserWithToken | Error | ValidatorError>) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    try {
        const user = await Database.user.findUnique({
            where: {
                email: req.body.email
            }
        });

        if (!user) {
            return res.status(404).send(
                {
                    code: 21000,
                    message: 'There is no user with that email address!'
                }
            );
        }

        const result = await compare(req.body.password, user.password);

        if (!result) {
            return res.status(401).send(
                {
                    code: 21001,
                    message: 'Password did not match!'
                }
            );
        }

        const jwtToken = sign(user);

        const token = await Database.token.create({
            data: {
                userId: user.id,
                token: jwtToken
            }
        });

        console.log(user);

        return res.status(200).send(
            {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                email: user.email,
                token: token.token
            }
        );
    } catch (e) {
        return res.status(500).send({ code: 10001, message: 'Unknown error!' });
    }
});


export default router;
