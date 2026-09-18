// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	// 公開 URL（GitHub Pages のプロジェクトサイト）。sitemap / RSS / OGP の絶対 URL に使われる
	site: 'https://enoenomirai-beep.github.io',
	// リポジトリ名がサブパスになる。サイト内リンクは src/consts.ts の withBase() を通す
	base: '/ramen-blog',

	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [mdx(), sitemap()],
});
