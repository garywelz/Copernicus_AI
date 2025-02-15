declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TWITTER_API_KEY: string;
      TWITTER_API_SECRET: string;
      TWITTER_ACCESS_TOKEN: string;
      TWITTER_ACCESS_SECRET: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {}; 