import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  site: 'https://copernicusai.app',
  output: 'static',
  build: {
    assets: '_assets',
  },
}); 