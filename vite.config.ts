/** @format */

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
const INVALID_CHAR_REGEX = /[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g;
const DRIVE_LETTER_REGEX = /^[a-z]:/i;
export default defineConfig({
	plugins: [vue()],
	server: {
		host: '192.168.31.234', // 监听所有网络接口
		port: 3000, // 可以指定端口，默认是5173
	},
	build: {
		outDir: 'docs',
		rollupOptions: {
			output: {
				// https://github.com/rollup/rollup/blob/master/src/utils/sanitizeFileName.ts
				sanitizeFileName(name) {
					const match = DRIVE_LETTER_REGEX.exec(name);
					const driveLetter = match ? match[0] : '';
					// A `:` is only allowed as part of a windows drive letter (ex: C:\foo)
					// Otherwise, avoid them because they can refer to NTFS alternate data streams.
					return driveLetter + name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, '');
				},
			},
		},
	},
	base: process.env.NODE_ENV === 'production' ? '/weight-gain-planner/' : '/',
});
