import { Status } from '@prisma/client';
import { prisma } from '../services/db.service';
import { logger } from '../utils';
import { getInsightsPrompt, getQuotesPrompt, getSummaryPrompt } from './prompts';
import { getAIOutput } from './utils';

export const startAIWriter = async ({
    contentId,
    language,
    source,
}: {
    contentId: string;
    language: string;
    source: string;
}) => {
    await Promise.all([
        writeSummary({ contentId, language, source }),
        writeInsights({ contentId, language, source }),
        writeQuotes({ contentId, language, source }),
    ]);
};

const writeSummary = async ({
    contentId,
    language,
    source,
}: {
    contentId: string;
    language: string;
    source: string;
}) => {
    try {
        const summaryRecord = await prisma.summary.create({
            data: {
                status: Status.writing,
                contentId,
            },
        });

        const { result, isFlagged } = await getAIOutput(getSummaryPrompt(source, language));
        if (isFlagged) throw new Error('Content is flagged');

        await prisma.summary.update({
            where: {
                id: summaryRecord.id,
            },
            data: {
                status: Status.ready,
                result,
            },
        });
    } catch (error) {
        logger.error('Error writing summary', error);
        await prisma.summary.update({
            where: {
                id: contentId,
            },
            data: {
                status: Status.failed,
            },
        });
    }
};

const writeInsights = async ({
    contentId,
    language,
    source,
}: {
    contentId: string;
    language: string;
    source: string;
}) => {
    try {
        const insightsRecord = await prisma.insight.create({
            data: {
                status: Status.writing,
                contentId,
            },
        });
        const { result, isFlagged } = await getAIOutput(getInsightsPrompt(source, language));
        if (isFlagged) throw new Error('Content is flagged');

        await prisma.insight.update({
            where: {
                id: insightsRecord.id,
            },
            data: {
                status: Status.ready,
                result,
            },
        });
    } catch (error) {
        logger.error('Error writing insights', error);
        await prisma.insight.update({
            where: {
                id: contentId,
            },
            data: {
                status: Status.failed,
            },
        });
    }
};

const writeQuotes = async ({
    contentId,
    language,
    source,
}: {
    contentId: string;
    language: string;
    source: string;
}) => {
    try {
        const quotesRecord = await prisma.quote.create({
            data: {
                status: Status.writing,
                contentId,
            },
        });
        const { result, isFlagged } = await getAIOutput(getQuotesPrompt(source, language));
        if (isFlagged) throw new Error('Content is flagged');

        await prisma.quote.update({
            where: {
                id: quotesRecord.id,
            },
            data: {
                status: Status.ready,
                result,
            },
        });
    } catch (error) {
        logger.error('Error writing quotes', error);
        await prisma.quote.update({
            where: {
                id: contentId,
            },
            data: {
                status: Status.failed,
            },
        });
    }
};
