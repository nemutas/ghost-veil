import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	root: './src',
	base: '/',
	plugins: [],
	build: {
		rollupOptions: {
			input: {
				home: path.resolve(__dirname, './src/index.html')
			}
		},
		outDir: '../dist'
	}
})
