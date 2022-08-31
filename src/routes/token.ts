import { Response, Router } from 'express';
import { Error, Request } from '../interfaces/express';
import { Database } from '../main';
import { authorization } from '../middlewares/authorization';

const router = Router();

router.use(authorization);

router.delete('/', async (req: Request, res: Response<Error | {}>) => {
    const user = req.user;

    if (!user) {
        return res.status(500).send({
            code: 10004,
            message: 'User information could not be retrieved!'
        });
    }

    const { count } = await Database.token.deleteMany({
        where: {
            userId: user.id,
            token: req.token
        }
    });

    return res.status(count > 0 ? 204 : 404).send({});
});

export default router;
