export type PromptType = {
    messages: {
        content: string;
        role: 'system' | 'user';
    }[];
    config: {
        temperature: number;
        maxTokens: number;
        topP: number;
        frequencyPenalty: number;
        presencePenalty: number;
    };
    model: 'gpt-4-turbo-preview' | 'gpt-4-turbo'; // etc..
};
