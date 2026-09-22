import type { APIRoute } from 'astro';
import { withBase } from '../consts';
import { getPublishedPosts } from '../lib/posts';

/**
 * /search.json — コマンドパレット（Ctrl+K）用の軽量な記事インデックス。
 * 本文の全文検索は /search/（search.astro）が別方式（DOM 埋め込み）で担当しているので、
 * ここでは店名・タイトル・系統・場所・タグだけの、すぐジャンプするための簡易データにする。
 */
export const GET: APIRoute = async () => {
	const posts = await getPublishedPosts();
	const items = posts.map((post) => ({
		id: post.id,
		shopName: post.data.shop_name,
		title: post.data.title,
		style: post.data.style,
		location: post.data.location,
		tags: post.data.tags,
		rating: post.data.rating,
		href: withBase(`/posts/${post.id}/`),
	}));
	return new Response(JSON.stringify(items), {
		headers: { 'Content-Type': 'application/json' },
	});
};
