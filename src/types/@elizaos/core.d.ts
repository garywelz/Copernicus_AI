declare module '@elizaos/core' {
  export interface IAgentRuntime {
    character?: {
      name: string;
      modelProvider: string;
      bio: string[];
      lore: string[];
      messageExamples: string[];
      postExamples: string[];
      topics: string[];
      adjectives: string[];
      style: {
        all: string[];
        chat: string[];
        post: string[];
      };
      clients: string[];
      plugins: string[];
      settings?: {
        secrets?: {
          OPENROUTER_API_KEY?: string;
        };
      };
    };
  }

  export enum ModelProviderName {
    OPENROUTER = 'openrouter'
  }
} 