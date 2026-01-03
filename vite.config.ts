import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    host: true, // listen on all network interfaces
    port: 5173,
    allowedHosts: ['viking.spelledabc.org', 'api.spelledabc.org', 'dev.spelledabc.org', 'dev-api.spelledabc.org', 'ben.spelledabc.org', 'localhost', '127.0.0.1']
  }
});
