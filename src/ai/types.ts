export type PromptType = {
    messages: {
        content: string;
        role: 'system' | 'user';
    }[];
    config: {
        temperature: number;
        max_tokens: number;
        top_p: number;
        frequency_penalty: number;
        presence_penalty: number;
    };
    model: 'gpt-4-turbo-preview' | 'gpt-4-turbo'; // etc..
};
