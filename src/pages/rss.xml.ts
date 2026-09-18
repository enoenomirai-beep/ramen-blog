import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_DESCRIPTION, SITE_TITLE, withBase } from '../consts';

/** /rss.xml — 記事の RSS フィード */
export const GET: APIRoute = async (context) => {
	const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
		(a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
	);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		// astro.config.mjs の site が必須。チャンネルの <link> をブログのトップ（base 込み）にする
		site: new URL(withBase('/'), context.site!),
		customData: '<language>ja</language>',
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.date,
			description: post.data.description ?? `${post.data.shop_name}（${post.data.location}）のレビュー`,
			link: withBase(`/posts/${post.id}/`),
			categories: [post.data.style, ...post.data.tags],
		})),
	});
};
