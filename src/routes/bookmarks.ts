import { Request, Response, Router } from 'express';
import { param, validationResult } from 'express-validator';
import { Bookmark } from '../interfaces';
import { BodyRequest, Error, ValidatorError } from '../interfaces/express';
import { Database } from '../main';
import { authorization } from '../middlewares/authorization';

const router = Router();

router.use(authorization);

router.get('/:id?', [param('id').optional({ nullable: true }).isNumeric()], async (req: Request, res: Response<Bookmark[] | Error | ValidatorError>) => {
    const user = req.user!!;

    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    const bookmarks = await Database.bookmark.findMany({
        where: {
            userId: user.id,
            parentId: req.params.id ? parseInt(req.params.id, 10) : null
        }
    });

    console.log(bookmarks);

    return res.status(200).send(bookmarks);
});

interface AddBookmarkBody extends Omit<Bookmark, 'id' | 'folder'> {
    folder: boolean | null;
}

router.post('/', async (req: BodyRequest<AddBookmarkBody>, res: Response<Bookmark | Error>) => {
    const user = req.user!!;

    const isFolder = req.body.folder ?? false;
    const bookmark = await Database.bookmark.create({
        data: isFolder ? {
            userId: user.id,
            title: req.body.title,
            folder: isFolder,
            parentId: req.body.parentId
        } : {
            userId: user.id,
            title: req.body.title,
            url: req.body.url,
            favicon: req.body.favicon,
            folder: isFolder,
            parentId: req.body.parentId
        }
    });

    return res.status(201).send(
        {
            id: bookmark.id,
            title: bookmark.title,
            url: bookmark.url,
            favicon: bookmark.favicon,
            folder: bookmark.folder,
            parentId: bookmark.parentId
        }
    );
});

router.delete('/:id', [param('id').isNumeric()], async (req: Request, res: Response) => {
    const user = req.user!!;

    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    const { count } = await Database.bookmark.deleteMany({
        where: {
            id: parseInt(req.params.id, 10),
            userId: user.id
        }
    });

    return res.status(count > 0 ? 204 : 404).send({});
});

router.patch('/:id', [param('id').isNumeric()], async (req: BodyRequest<Omit<Bookmark, 'id' | 'folder'>>, res: Response<Bookmark | Error | ValidatorError>) => {
    const user = req.user!!;

    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    const bookmark = await Database.bookmark.findFirst({
        where: {
            id: parseInt(req.params.id, 10),
            userId: user.id
        }
    });

    if (!bookmark) {
        return res.status(404).send(
            {
                code: 30000,
                message: 'Bookmark does not exist!'
            }
        );
    }

    const { count } = await Database.bookmark.updateMany({
        where: {
            id: bookmark.id,
            userId: user.id
        },
        data: bookmark.folder ? {
            title: req.body.title,
            parentId: req.body.parentId
        } : {
            title: req.body.title,
            url: req.body.url,
            favicon: req.body.favicon,
            parentId: req.body.parentId
        }
    });

    if (count < 1) {
        return res.status(500).send(
            {
                code: 33000,
                message: 'An unexpected error prevented the bookmark from being updated!'
            }
        );
    }

    return res.status(200).send(
        {
            id: bookmark.id,
            title: req.body.title,
            url: !bookmark.folder ? req.body.url : null,
            favicon: !bookmark.folder ? req.body.favicon : null,
            folder: bookmark.folder,
            parentId: req.body.parentId
        }
    );
});

export default router;
