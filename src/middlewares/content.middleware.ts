import { body } from 'express-validator';
import { rejectUnkownParams, validateParams } from '../utils';
import { Request, Response, NextFunction } from 'express';

const createContentValidator = [
    (req: Request, res: Response, next: NextFunction) =>
        rejectUnkownParams(req, res, next, ['source', 'isoLang']),
    body('source', 'Required').notEmpty(),
    body('source', 'The minimum length is 300 characters').isLength({ min: 300 }),
    body('isoLang', 'Required').notEmpty(),
    body('isoLang', 'Invalid language code').isLength({ min: 2, max: 2 }),
    validateParams,
];

export default {
    createContentValidator,
};
