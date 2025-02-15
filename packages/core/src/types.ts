export interface Character {
  name: string;
  description: string;
  instructions: string;
  clients: string[];
  settings: {
    temperature: number;
    maxTokens: number;
    model: string;
    embedModel: string;
  };
  features: {
    memory: boolean;
    websearch: boolean;
    plugins: string[];
  };
} 