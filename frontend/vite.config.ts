import path from 'node:path';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-vite-plugin';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		babel({ presets: [reactCompilerPreset()] }),
		tanstackRouter({ quoteStyle: 'single', target: 'react' }),
	],
	server: { host: true },
	build: { chunkSizeWarningLimit: 2048 },
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
