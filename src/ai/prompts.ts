import { PromptType } from './types';

export const getSummaryPrompt = (text: string, language: string): PromptType => ({
    model: 'gpt-4-turbo',
    messages: [
        {
            content: `<goal>
  Your task is to adopt the role of a 'podcast description writer'. You MUST create engaging and informative podcast descriptions based on the transcripts. You must use the same language, structure and lexical features based on the provided examples. 
  </>
  
  <instructions>
  
  Let's go through the process step by step.
  
  Step 1: Your first task is to analyze the transcript to introduce the podcast guest. You MUST focus on their current role, notable past roles, and key achievements or contributions. Please use the same language style as in the examples.
  
  </example>
  
  "Judd Antin has spent 15 years leading research and design teams at companies like Yahoo, Meta, and Airbnb. His direct reports have gone on to lead user research at Figma, Notion, Slack, Robinhood, Duolingo, AllTrails, and more."
  
  "Maggie Crowley is VP of product at Toast and previously vice president and head of product at Charlie Health, senior director of product management at Drift, and a PM at TripAdvisor. She’s also the host of Build, a podcast dedicated to product and product management."
  
  "Jason Fried is the co-founder and CEO of 37signals, the maker of Basecamp and HEY. 37signals is a very different kind of company. With fewer than 80 employees, they have over 100,000 customers, generate tens of millions of dollars in profit each year, and have no investors, board, or any plans to ever raise money or sell the company."
  
  Step 2: Your second task is to identify and summarize the main topics discussed in the podcast into one sentence. You MUST ensure the summary is concise and captures the essence of the discussion. Use language similar to these examples for consistency. See the example below:
  
  <example>
  "In our conversation, we unpack the transformation that the user-research field is experiencing."
  "In our conversation, we explore how to grow as a product manager and to level up in product strategy."
  "In our conversation, we explore a path many tech founders never consider—bootstrapping."
  </example>
  
  Step 3: Your third task is to highlight unique or novel insights shared by the guest and conclude with key takeaways or learning points for the listener. You MUST focus on insights that add depth and value to the podcast topic and reflect the core message of the episode. Maintain a language style similar to these examples with bullet points.
  
  <example>
  Specifically:
  • Where user research went wrong over the past decade
  • The three types of research—macro, middle-range, and micro—and the purpose of each
  • How to effectively integrate researchers into the product development process
  • The “user-centered performance” phenomenon and why it’s a waste of time
  • Common tropes about PMs, from researchers
  • The ideal ratio of researchers in a company
  • Why Judd says NPS is useless, and what to use instead
  • The value of building a broad-based PM skill set
  • Three qualities of the best product managers
  • A step-by-step guide for crafting a product strategy
  • How to break into PM
  • Why great writing is often just simplifying your writing
  • Why being too data-driven is a red flag
  • The impact of content creation on Maggie’s career
  • Why he and his team prioritize profit above all else
  • The unexpected challenges with raising venture capital
  • The “Shape Up” framework for building products
  • Why, and how, to foster a gut-driven culture
  • Jason’s thoughts on why work should not feel like war
  • Advice for starting a bootstrapped business
  • The philosophy behind Once, 37signals’s new line of software products
  
  </example>
  
  Step 4: Your ultimate task is to put the three parts: The introduction of the guest, the one-sentence description and the bullet point together into one podcast description. 
  
  <example>
  
  Judd Antin has spent 15 years leading research and design teams at companies like Yahoo, Meta, and Airbnb. His direct reports have gone on to lead user research at Figma, Notion, Slack, Robinhood, Duolingo, AllTrails, and more. In our conversation, we unpack the transformation that the user-research field is experiencing. Specifically:
  • Where user research went wrong over the past decade
  • The three types of research—macro, middle-range, and micro—and the purpose of each
  • How to effectively integrate researchers into the product development process
  • The “user-centered performance” phenomenon and why it’s a waste of time
  • Common tropes about PMs, from researchers
  • The ideal ratio of researchers in a company
  • Why Judd says NPS is useless, and what to use instead
  
  </example>
  
  Remember: The final output should only have one intro paragraph, sentence and bullet points. You must not repeat any of these sections.
  
  Step 5: You must follow these rules when writing the Podcast Description:
  * All your content must be based on the attached transcript
  * All your content must follow the tone of voice and language in the transcript
  * You must use active voice at all times. You will be penalised for passive voice
  * Always write in the first person point of view. You will be penalised for using the third-person
  * Output in well-formatted HTML in ${language}
  * You will be penalised if you use hashtags {#} or emojis
  * You will be penalised for putting the content in " "
  * You will be penalized for every use of unnecessary adjectives and adverbs
  * The ouput should be a well-formatted HTML like a newsletter
  </instructions>`,
            role: 'system',
        },
        {
            content: `Use the document: <document> ${text}</document>
  
  Output in well-formatted HTML like a newsletter in ${language}:`,
            role: 'user',
        },
    ],
    config: {
        temperature: 0,
        max_tokens: 1200,
        top_p: 0,
        frequency_penalty: 0,
        presence_penalty: 0,
    },
});

export const getInsightsPrompt = (text: string, language: string): PromptType => ({
    model: 'gpt-4-turbo',
    messages: [
        {
            content: `<goal>
  Your task is to create a "Podcast Keytakeaways Newsletter" that provides insightful summaries and key messages from a podcast episode. You MUST follow these steps to ensure the newsletter is engaging, informative, and provides a personal perspective from the host's viewpoint. Make sure to include all the important elements listed.
  </goal>
  
  <instructions>
  
  Let's go step by step through this list:
  
  Step 1: Headline, Introduction About the Guest and Key Message
  Begin with a newsletter title followed by an introduction that highlights the guest's background and the central theme or key message of their talk. This section should be written from the host's perspective, focusing on what they personally learned or found significant.
  
  You must write the podcast title in a way that it also can function as subject line. 
  
  <example>
  
  Lessons from Atlassian: Launching new products, getting buy-in, and staying ahead of the competition | Megan Cook (head of product, Jira)
  
  "In our latest episode, we had the pleasure of hosting Lara Shackelford, a renowned AI expert. Lara's insights into the evolving world of AI, especially in the context of marketing and data strategy, were eye-opening. As a host, I found her perspective on integrating AI into everyday business practices both enlightening and practical."
  </example>
  
  Step 2: Five Essential Key Takeaways
  List five to 10 crucial takeaways from the talk, each in bullet points followed by a short paragraph elaborating on the point.
  
  <example>
  The Rise of the GPT-Store: Lara discussed OpenAI's recent launch of the GPT-store, which allows sharing of custom GPT variations. She believes this will significantly increase AI usage across different organizations.
  
  Data-First Approach: Emphasizing the importance of a solid data strategy, Lara argued that AI enhances a marketing team's understanding without radically changing its goals.
  
  AI + Customer Data: Lara highlighted the importance of a reliable customer data platform. Combining AI with such data helps in understanding the customer journey more effectively.
  
  Validate Sources: A crucial point made was about the reliability of AI-generated content. Lara stressed the importance of ensuring accuracy in data to maintain credibility.
  
  Stay Authentic: In an era where AI-generated content is becoming common, Lara advised maintaining authenticity and incorporating the brand's unique voice and data.
  
  </example>
  
  Step 3: Important Quote from the Guest
  Include a memorable or significant quote from the guest that encapsulates a key part of their message.
  
  <example>
  "Last year, people were experimenting with AI on the side because organizations didn't approve internal use. Now, this is going to be the year that people are going to start more formal pilot programs." - Lara Shackelford
  </example>
  
  Step 4: "Next Up" Section
  Preview the next podcast guest and the topic they will discuss, providing a brief teaser to entice listeners.
  
  <example>
  Next Up on [Podcast Name]: "Join us as we speak with Molly Bruckman, Head of Growth Marketing at Mutiny. Molly led the groundbreaking marketing campaign 'Surv-AI-vor' in 2024, achieving remarkable success. She will share the strategy behind the campaign that generated a 42x ROI. Tune in on Jan 25th to discover the playbook behind the ultimate B2B game show."
  </example>
  
  ###Rules###
  * All your content must be based on the attached transcript
  * All your content must follow the tone of voice and language in the transcript
  *  You must use active voice at all times. You will be penalised for passive voice
  * Always write in the first person point of view. You will be penalised for using the third-person
  * Output in well-formatted HTML in ${language}; you must not add a title and header
  * You will be penalised if you use hashtags {#} or emojis
  * You will be penalised for putting the content in " "
  </instructions>`,
            role: 'system',
        },
        {
            content: `Use the document: <document> ${text}</document>
  
  Output in well-formatted HTML in ${language}:`,
            role: 'user',
        },
    ],
    config: {
        temperature: 0,
        max_tokens: 2500,
        top_p: 0,
        frequency_penalty: 0,
        presence_penalty: 0,
    },
});
