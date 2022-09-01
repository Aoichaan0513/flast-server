import { isWithinInterval, subDays } from 'date-fns';
import { Response, Router } from 'express';
import { decode, JwtPayload } from 'jsonwebtoken';
import { BodyRequest, Error } from '../interfaces/express';
import { Database } from '../main';
import { authorization } from '../middlewares/authorization';
import { sign } from '../utils/jwt';

const router = Router();

router.use(authorization);

router.delete('/', async (req: BodyRequest, res: Response<Error | {}>) => {
    const user = req.user!!;

    const { count } = await Database.token.deleteMany({
        where: {
            userId: user.id,
            token: req.token
        }
    });

    return res.status(count > 0 ? 204 : 404).send({});
});

router.patch('/', async (req: BodyRequest, res: Response<Error | { token: string; }>) => {
    const user = req.user!!;
    const decoded = decode(req.token!!) as JwtPayload;

    const expiredAt = new Date(0);
    expiredAt.setUTCSeconds(decoded.exp!!);

    const refreshStartAt = subDays(expiredAt, 3);

    if (!isWithinInterval(new Date(), { start: refreshStartAt, end: expiredAt })) {
        return res.status(405).send(
            {
                code: 22000,
                message: 'It\'s outside the token renewal period!'
            }
        );
    }

    const jwtToken = sign(user);

    const { count } = await Database.token.updateMany({
        where: {
            userId: user.id,
            token: req.token
        },
        data: {
            token: jwtToken
        }
    });

    if (count < 1) {
        return res.status(401).send(
            {
                code: 22001,
                message: 'No tokens available to update!'
            }
        );
    }

    return res.status(200).send({ token: jwtToken });
});

export default router;
