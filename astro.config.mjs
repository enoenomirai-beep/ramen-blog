// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	// 公開 URL（独自ドメイン。2026-09-23 に GitHub Pages のプロジェクトサイトから移行）。
	// sitemap / RSS / OGP の絶対 URL に使われる
	site: 'https://eno-ramen.com',
	// 独自ドメイン配信なのでサブパスは無し（base はデフォルトの '/'）。
	// サイト内リンクは引き続き src/consts.ts の withBase() を通す（base が '/' でも動作する）

	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [mdx(), sitemap()],
});
