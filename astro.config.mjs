import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https://ravenac.com/',
  output: 'server',
  adapter: netlify(),
  integrations: [react()]
});