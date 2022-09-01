import { Response, Router } from 'express';
import { User } from '../interfaces';
import { BodyRequest, Error } from '../interfaces/express';
import { Database } from '../main';
import { authorization } from '../middlewares/authorization';

const router = Router();

router.use(authorization);

router.get('/', async (req: BodyRequest, res: Response<User | Error>) => {
    const user = req.user;

    console.log(user);

    return res.status(200).send(user);
});

interface PatchUserBody extends Pick<User, 'name' | 'email'> {
    password: string;
}

router.patch('/', async (req: BodyRequest<PatchUserBody>, res: Response<User | Error>) => {
    const user = req.user!!;

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
