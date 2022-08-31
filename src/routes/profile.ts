import { Response, Router } from 'express';
import { User } from '../interfaces';
import { Error, Request } from '../interfaces/express';
import { authorization } from '../middlewares/authorization';

const router = Router();

router.use(authorization);

router.get('/', async (req: Request, res: Response<User | Error>) => {
    const user = req.user;

    console.log(user);

    return res.status(200).send(user);
});

export default router;
