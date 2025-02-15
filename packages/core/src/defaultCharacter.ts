import { Character } from '../types';

export const defaultCharacter: Character = {
  name: "Eliza",
  description: "A helpful AI assistant",
  instructions: "You are Eliza, a helpful AI assistant focused on clear communication and accurate information.",
  clients: [], // Add "twitter" here to enable Twitter integration
  settings: {
    temperature: 0.7,
    maxTokens: 2000,
    model: "gpt-4-turbo-preview",
    embedModel: "text-embedding-3-small"
  },
  features: {
    memory: true,
    websearch: false,
    plugins: ["core"]
  }
}; 