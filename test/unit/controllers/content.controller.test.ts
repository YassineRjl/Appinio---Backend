// test/unit/controllers/content.controller.test.ts
import { Request, Response } from 'express';
import contentController from '../../../src/controllers/content.controller';
import contentService from '../../../src/services/content.service';
import { Insight, Quote, Summary } from '@prisma/client';

jest.mock('../../../src/services/content.service');

const MOCK_CONTENT_ID = '45e75b05-fbd4-4006-950a-227fad84ab06';

describe('content.controller', () => {
    let req: Request;
    let res: Response;
    let next: jest.Mock;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
        } as unknown as Request;
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as unknown as Response;
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new content record', async () => {
            const contentData = {
                source: 'Test content source',
                isoLang: 'en',
            };
            req.body = contentData;
            (contentService.create as jest.Mock).mockResolvedValueOnce(MOCK_CONTENT_ID);

            await contentController.create(req, res, next);

            expect(contentService.create).toHaveBeenCalledWith(contentData);
            expect(res.json).toHaveBeenCalledWith(MOCK_CONTENT_ID);
        });

        it('should handle errors and call next', async () => {
            const error = new Error('Test error');
            (contentService.create as jest.Mock).mockRejectedValueOnce(error);

            await contentController.create(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ message: 'Error creating content' });
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('get', () => {
        it('should retrieve a content record', async () => {
            req.params = { id: MOCK_CONTENT_ID };
            const mockContent = {
                id: MOCK_CONTENT_ID,
                isoLang: 'en',
                summaries: [] as Summary[],
                insights: [] as Insight[],
                quotes: [] as Quote[],
            };
            (contentService.get as jest.Mock).mockResolvedValueOnce({
                content: mockContent,
                status: 200,
            });

            await contentController.get(req, res, next);

            expect(contentService.get).toHaveBeenCalledWith(MOCK_CONTENT_ID);
            expect(res.json).toHaveBeenCalledWith(mockContent);
        });

        it('should handle errors and call next', async () => {
            const error = new Error('Test error');
            (contentService.get as jest.Mock).mockRejectedValueOnce(error);

            await contentController.get(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error getting content' });
            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
