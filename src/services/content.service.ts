import { Content } from '@prisma/client';
import ISO6391 from 'iso-639-1';
import { startAIWriter } from '../ai';
import { logger } from '../utils';
import { prisma } from './db.service';

/**
 * Creates new content.
 * @async
 * @function create
 * @param {string} isoLang - ISO language code.
 * @param {string} source - Text input.
 * @returns {Promise<Content>} Content creation result
 */
async function create({ isoLang, source }: { source: string; isoLang: string }) {
    const { id: contentId } = await prisma.content.create({
        data: {
            isoLang,
            source,
        },
    });

    const language = ISO6391.getName(isoLang);
    if (!language) throw new Error('language not found');

    // Long running task. To avoid request timeout, we start the AI writer in the background and let the frontend poll for the result
    startAIWriter({ contentId, language, source });

    logger.info('Write content request successful', { contentId });

    return contentId;
}

/**
 * Retrieves a content record with summaries and insights.
 * @async
 * @function get
 * @param {string} id - Content id.
 * @returns {Promise<Content>} Content record with summaries and insights.
 */
async function get(id: string) {
    const content = await prisma.content.findFirst({
        where: {
            id,
        },
        include: {
            summaries: true,
            insights: true,
            quotes: true,
        },
    });
    if (!content)
        return {
            status: 404,
            message: 'Content not found',
        };
    // remove the source since it's a large text
    delete content.source;
    logger.info('Retrieved content successfully', { id });
    return {
        status: 200,
        content,
    };
}

export default {
    create,
    get,
};
