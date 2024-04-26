// test/integration/content.test.ts
import request from 'supertest';
import { prisma } from '../../src/services/db.service';
import { app } from '../../src/app';

const INVALID_CONTENT_ID = '45e75b05-fbd4-4006-950a-227fad84ab06';
describe('Content API', () => {
    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('POST /content', () => {
        it('should create a new content record', async () => {
            const contentData = {
                source: 'This is a test content source. '.repeat(100), // Ensure minimum length
                isoLang: 'en',
            };

            const response = await request(app).post('/content').send(contentData);

            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
        });

        it('should return 422 if required fields are missing', async () => {
            const response = await request(app).post('/content').send({});

            expect(response.status).toBe(422);
            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('GET /content/:id', () => {
        it('should retrieve a content record', async () => {
            // Create a content record
            const contentData = {
                source: 'This is a test content source. '.repeat(100),
                isoLang: 'en',
            };
            const createResponse = await request(app).post('/content').send(contentData);
            const contentId = createResponse.body;

            // Retrieve the content record
            const response = await request(app).get(`/content/${contentId}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', contentId);
            expect(response.body).toHaveProperty('isoLang', 'en');
            expect(response.body).toHaveProperty('summaries');
            expect(response.body).toHaveProperty('insights');
            expect(response.body).toHaveProperty('quotes');
        });

        it('should return 404 if content record is not found', async () => {
            const response = await request(app).get(`/content/${INVALID_CONTENT_ID}`);
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Content not found');
        });
    });
});
