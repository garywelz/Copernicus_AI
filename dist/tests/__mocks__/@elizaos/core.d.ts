export declare enum ModelProviderName {
    OPENROUTER = "openrouter"
}
interface AgentCharacter {
    name: string;
    modelProvider: ModelProviderName;
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
    settings: {
        secrets: {
            [key: string]: string;
        };
    };
}
export interface IAgentRuntime {
    character: AgentCharacter;
}
export {};
