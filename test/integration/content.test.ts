// test/integration/content.test.ts
import request from 'supertest';
import { prisma } from '../../src/services/db.service';
import { app } from '../../src/app';

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
        });

        it('should return 500 if content record is not found', async () => {
            const response = await request(app).get('/content/invalid-id');

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error getting content');
        });
    });
});
