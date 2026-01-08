import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

// Set the base path for your repository if needed
const dev = process.env.NODE_ENV === 'development';
const base = dev ? '' : '/BookNook_frontend';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: false,
    }),
    paths: {
      base: base,
    },
    appDir: 'app',
  },
};

export default config;
