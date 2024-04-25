import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Express } from 'express';
import contentController from './controllers/content.controller';
import contentMiddlware from './middlewares/content.middleware';
import loggingMiddleware from './middlewares/logging.middleware';
import { limiter } from './utils';

dotenv.config();

export const app: Express = express();

app.use(limiter);

app.use(loggingMiddleware.logger);

app.use(cors()).use(express.json()).options('*', cors());

app.post('/content', contentMiddlware.createContentValidator, contentController.create);
app.get('/content/:id', contentController.get);

app.use(loggingMiddleware.errorLogger);
