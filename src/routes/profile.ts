import { Response, Router } from 'express';
import { User } from '../interfaces';
import { Error, Request } from '../interfaces/express';
import { Database } from '../main';
import { authorization } from '../middlewares/authorization';

const router = Router();

router.use(authorization);

router.get('/', async (req: Request, res: Response<User | Error>) => {
    const user = req.user;

    console.log(user);

    return res.status(200).send(user);
});

interface PatchUserBody extends Pick<User, 'name' | 'email'> {
    password: string;
}

router.patch('/', async (req: Request<PatchUserBody>, res: Response<User | Error>) => {
    const user = req.user;

    if (!user) {
        return res.status(500).send({
            code: 20004,
            message: 'User information could not be retrieved!'
        });
    }

    const updatedUser = await Database.user.update({
        where: {
            id: user.id
        },
        data: {
            name: req.body.name,
            email: req.body.email
        }
    });

    return res.status(200).send({
        id: user.id,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        email: updatedUser.email
    });
});

export default router;
