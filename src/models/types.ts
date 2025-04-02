export type SourceType = 'API' | 'OPEN_ACCESS' | 'PREPRINT';

export type SourceCategory = 
  | 'SCIENCE'
  | 'MEDICINE'
  | 'TECHNOLOGY'
  | 'SOCIAL_SCIENCE'
  | 'HUMANITIES'
  | 'EDUCATION'
  | 'MULTIDISCIPLINARY';

export interface SourceConfig {
  id: string;
  name: string;
  baseUrl: string;
  type: SourceType;
  category: SourceCategory;
  requiresAuth: boolean;
  rateLimit?: number;
  fields: string[];
} 