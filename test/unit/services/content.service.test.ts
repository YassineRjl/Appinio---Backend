// test/unit/services/content.service.test.ts
import { prisma } from '../../../src/services/db.service';
import contentService from '../../../src/services/content.service';
import { startAIWriter } from '../../../src/ai';
import { Insight, Summary } from '@prisma/client';

jest.mock('../../../src/services/db.service', () => ({
    prisma: {
        content: {
            create: jest.fn(),
            findFirstOrThrow: jest.fn(),
        },
    },
}));

jest.mock('../../../src/ai', () => ({
    startAIWriter: jest.fn(),
}));

describe('content.service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new content record', async () => {
            const contentData = {
                source: 'Test content source',
                isoLang: 'en',
            };
            const mockContentId = 'mock-content-id';
            (prisma.content.create as jest.Mock).mockResolvedValueOnce({ id: mockContentId });

            const result = await contentService.create(contentData);

            expect(prisma.content.create).toHaveBeenCalledWith({
                data: contentData,
            });
            expect(startAIWriter).toHaveBeenCalledWith({
                contentId: mockContentId,
                language: 'English',
                source: contentData.source,
            });
            expect(result).toBe(mockContentId);
        });

        it('should throw an error if language is not found', async () => {
            const contentData = {
                source: 'Test content source',
                isoLang: 'invalid',
            };

            await expect(contentService.create(contentData)).rejects.toThrow();
        });
    });

    describe('get', () => {
        it('should retrieve a content record with summaries and insights', async () => {
            const mockContentId = 'mock-content-id';
            const mockContent = {
                id: mockContentId,
                source: 'Test content source',
                isoLang: 'en',
                summaries: [] as Summary[],
                insights: [] as Insight[],
            };
            (prisma.content.findFirstOrThrow as jest.Mock).mockResolvedValueOnce(mockContent);

            const result = await contentService.get(mockContentId);

            expect(prisma.content.findFirstOrThrow).toHaveBeenCalledWith({
                where: { id: mockContentId },
                include: {
                    summaries: true,
                    insights: true,
                },
            });
            expect(result).toEqual({
                id: mockContentId,
                isoLang: 'en',
                summaries: [],
                insights: [],
            });
        });
    });
});
