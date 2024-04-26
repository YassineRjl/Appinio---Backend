// test/unit/services/content.service.test.ts
import { prisma } from '../../../src/services/db.service';
import contentService from '../../../src/services/content.service';
import { startAIWriter } from '../../../src/ai';
import { Insight, Quote, Summary } from '@prisma/client';

const MOCK_CONTENT_ID = '45e75b05-fbd4-4006-950a-227fad84ab06';

jest.mock('../../../src/services/db.service', () => ({
    prisma: {
        content: {
            create: jest.fn(),
            findFirst: jest.fn(),
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
            (prisma.content.create as jest.Mock).mockResolvedValueOnce({ id: MOCK_CONTENT_ID });

            const result = await contentService.create(contentData);

            expect(prisma.content.create).toHaveBeenCalledWith({
                data: contentData,
            });
            expect(startAIWriter).toHaveBeenCalledWith({
                contentId: MOCK_CONTENT_ID,
                language: 'English',
                source: contentData.source,
            });
            expect(result).toBe(MOCK_CONTENT_ID);
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
        it('should retrieve a content record with summaries, quotes, and insights', async () => {
            const mockContent = {
                status: 200,
                content: {
                    id: MOCK_CONTENT_ID,
                    isoLang: 'en',
                    summaries: [] as Summary[],
                    insights: [] as Insight[],
                    quotes: [] as Quote[],
                },
            };
            (prisma.content.findFirst as jest.Mock).mockResolvedValueOnce(mockContent);

            const result = await contentService.get(MOCK_CONTENT_ID);

            expect(prisma.content.findFirst).toHaveBeenCalledWith({
                where: { id: MOCK_CONTENT_ID },
                include: {
                    summaries: true,
                    insights: true,
                    quotes: true,
                },
            });
            expect(result.content).toEqual({
                status: 200,
                content: {
                    id: MOCK_CONTENT_ID,
                    isoLang: 'en',
                    summaries: [],
                    insights: [],
                    quotes: [],
                },
            });
        });
    });
});
