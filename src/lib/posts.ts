import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** 公開中（draft でない）の記事を、日付の新しい順で返す。一覧・RSS・記事ページ・系統別ページで共通 */
export async function getPublishedPosts(): Promise<Post[]> {
	const posts = await getCollection('posts', ({ data }) => !data.draft);
	return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** 系統名 → その系統の記事（渡した順を保つ）。キーの順序は最初に出現した順 */
export function groupByStyle(posts: Post[]): Map<string, Post[]> {
	const map = new Map<string, Post[]>();
	for (const post of posts) {
		const list = map.get(post.data.style);
		if (list) list.push(post);
		else map.set(post.data.style, [post]);
	}
	return map;
}

/** 系統別ページの URL パス（base なし）。`withBase()` を通して使う */
export function stylePath(style: string): string {
	return `/styles/${encodeURIComponent(style)}/`;
}
