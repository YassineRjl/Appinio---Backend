import { ModerationCreateResponse } from 'openai/resources';
import OpenAI from 'openai';
import { PromptType } from './types';
import { OPENAI_BANNED_WORDS, logger } from '../utils';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const getAIOutput = async (prompt: PromptType, retry: number = 0) => {
    if (retry === 3) throw new Error('Failed to get AI output');
    try {
        const moderation = (await openai.moderations.create({
            input: prompt.messages.find((m) => m.role === 'user')?.content ?? '',
        })) as ModerationCreateResponse;

        if (moderation.results[0].flagged) {
            return {
                result: null,
                isFlagged: true,
            };
        }

        const data = await openai.chat.completions.create({
            model: prompt.model,
            logit_bias: OPENAI_BANNED_WORDS,
            max_tokens: prompt.config.max_tokens,
            temperature: prompt.config.temperature,
            top_p: prompt.config.top_p,
            frequency_penalty: prompt.config.frequency_penalty,
            presence_penalty: prompt.config.presence_penalty,
            messages: prompt.messages,
        });

        return {
            result: data.choices[0].message?.content,
            isFlagged: false,
        };
    } catch (error) {
        logger.error('Error getting AI output', error);
        sleep(1000);
        // through experience, I learnt OpenAI throws 500 randomly sometimes, so retrying helps
        // We could go with exponential backoff, but for simplicity, we retry 3 times
        getAIOutput(prompt, retry + 1);
    }
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
