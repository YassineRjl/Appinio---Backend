import { NextFunction, Request, Response } from 'express';
import content from '../services/content.service';
import { Content } from '@prisma/client';
/**
 * Creates a new content record with a summary, insights, and quotes.
 * @async
 * @function create
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 * @returns {Promise<string>} - Promise that resolves the content id.
 */
async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const contentId = await content.create(req.body);
        return res.json(contentId);
    } catch (err) {
        // avoid returning the error message to the client to avoid leaking sensitive information
        res.status(500).send({ message: 'Error creating content' });
        next(err);
    }
}

/**
 * Retrieves a content record
 * @async
 * @function get
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 * @returns {Promise<Content>} - Promise that resolves when the response is sent.
 */
async function get(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params as { id: string };
        const record = await content.get(id);
        if (record.status === 404)
            return res.status(record.status).json({ message: record.message });
        return res.json(record.content);
    } catch (err) {
        // avoid returning the error message to the client to avoid leaking sensitive information
        res.status(500).json({ message: 'Error getting content' });
        next(err);
    }
}

export default {
    get,
    create,
};
