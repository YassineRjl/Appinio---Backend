// test/unit/controllers/content.controller.test.ts
import { Request, Response } from 'express';
import contentController from '../../../src/controllers/content.controller';
import contentService from '../../../src/services/content.service';
import { Insight, Summary } from '@prisma/client';

jest.mock('../../../src/services/content.service');

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
            const mockContentId = 'mock-content-id';
            (contentService.create as jest.Mock).mockResolvedValueOnce(mockContentId);

            await contentController.create(req, res, next);

            expect(contentService.create).toHaveBeenCalledWith(contentData);
            expect(res.json).toHaveBeenCalledWith(mockContentId);
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
            const mockContentId = 'mock-content-id';
            req.params = { id: mockContentId };
            const mockContent = {
                id: mockContentId,
                isoLang: 'en',
                summaries: [] as Summary[],
                insights: [] as Insight[],
            };
            (contentService.get as jest.Mock).mockResolvedValueOnce(mockContent);

            await contentController.get(req, res, next);

            expect(contentService.get).toHaveBeenCalledWith(mockContentId);
            expect(res.json).toHaveBeenCalledWith(mockContent);
        });

        it('should handle errors and call next', async () => {
            const error = new Error('Test error');
            (contentService.get as jest.Mock).mockRejectedValueOnce(error);

            await contentController.get(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ message: 'Error creating content' });
            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
