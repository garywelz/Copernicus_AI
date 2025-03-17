/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SPOTIFY_CLIENT_ID: string;
  readonly SPOTIFY_CLIENT_SECRET: string;
  readonly SPOTIFY_SHOW_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 